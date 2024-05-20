
// Clases de la biblioteca
// import * as THREE from "three"

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import * as TWEEN from '../libs/tween.esm.js'

// Clases de mi proyecto

import { Tubo } from './Tubo.js'
import { Fish } from './Fish.js'
import { Penwin } from './Penwin.js'
import { SeaLion } from './SeaLion.js'
import { Puffin } from './Puffin.js'
import { MoonFish } from './MoonFish.js'
import { Sardine } from './Sardine.js'
import { PickHelper } from './PickHelper.js'
 
/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

class MyScene extends THREE.Scene {
  // Recibe el  div  que se ha creado en el  html  que va a ser el lienzo en el que mostrar
  // la visualización de la escena
  constructor (myCanvas) { 

    super();
    this.right = false;
    this.left = false;
    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);
    
    // Se crea la interfaz gráfica de usuario
    this.gui = this.createGUI ();
    this.thirdPerson = true;

    // Construimos los distinos elementos que tendremos en la escena

    // El modelo puede incluir su parte de la interfaz gráfica de usuario. Le pasamos la referencia a 
    // la gui y el texto bajo el que se agruparán los controles de la interfaz que añada el modelo.
    this.tube = new Tubo(this.gui, "Controles del tubo");
    //this.model = new Fish(this.gui, "Controles del pez");
    this.penwin = new Penwin(this.gui, "Controles del pingu");
    //this.model = new SeaLion(this.gui, "Controles del león marino");
    this.puffin = new Puffin(this.gui, "Controles del frailecillo");
    //this.model = new MoonFish(this.gui, "Controles del frailecillo");
    //this.model = new Sardine(this.gui, "Controles del frailecillo");
    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(variable)

    this.createCamera ();
    
    // Picking
    const pickPosition = {x: 0, y: 0};

    function getCanvasRelativePosition(event) {
      const rect = myCanvascanvas.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) * myCanvascanvas.width  / rect.width,
        y: (event.clientY - rect.top ) * myCanvascanvas.height / rect.height,
      };
    }

    function setPickPosition(event) {
      const pos = getCanvasRelativePosition(event);
      pickPosition.x = (pos.x / myCanvascanvas.width ) *  2 - 1;
      pickPosition.y = (pos.y / myCanvascanvas.height) * -2 + 1;  // note we flip Y
    }

    window.addEventListener('click', setPickPosition);

    const pickHelper = new PickHelper();
    pickHelper.pick(pickPosition, this, this.camera, this.time);

    // Colisiones

    function collisionAction(object){
      print("Colisión con: " + object);
    }

    function checkCollisions(){
      objects = {
        penwin: this.penwin,
        fish: this.fish,
        moonfish: this.moonfish,
        sardine: this.sardine,
        sealion: this.sealion,
        puffin: this.puffin
      }

      for(object in objects){
        if(this.penwin.intersectsBox(object)){
          collisionAction(object);
        }
      }
    }

    // Modificar los frailecillos
    this.puffin.scale.set(0.25, 0.25, 0.25);
    this.puffin.position.set(0, 3, 0);
    this.puffin.rotation.z = (-45 * Math.PI) / 180;

    this.modifiedpuffin = new THREE.Scene();
    this.modifiedpuffin.add(this.puffin);

    this.puffinpath_pts = [new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(4, 0, 0),
      new THREE.Vector3(4, 2, 0),
      new THREE.Vector3(0, 0, 4),
      ];

    this.puffinpath = new THREE.CatmullRomCurve3(this.puffinpath_pts, true);
    // Crear las luces
    this.createLights ();
    
    // Tendremos una cámara con un control de movimiento con el ratón
    
    // Un suelo 
    //this.createGround ();

    //this.createWall ();
    
    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    // Todas las unidades están en metros
    this.axis = new THREE.AxesHelper (0.1);
    this.add (this.axis);

    // Definir animaciones
    this.segmentos = 100;
    this.binormales_tubepath = this.tube.tubepath.computeFrenetFrames(this.segmentos, true).binormals;

    var origen = {t : 0};
    var fin = {t : 1};
    var tiempoDeRecorrido = 30000;

    this.penwinAnimation = new TWEEN.Tween(origen).to(fin, tiempoDeRecorrido) .onUpdate(() => {
      var posicion = this.tube.tubepath.getPointAt(origen.t);
      var tangente = this.tube.tubepath.getTangentAt(origen.t);
      this.penwin.position.copy(posicion);
      posicion.add(tangente);
      this.penwin.up = this.binormales_tubepath[Math.floor(origen.t * this.segmentos)];
      this.penwin.lookAt(posicion);
    })
    .repeat(Infinity)
    .start();

    this.binormales_puffinpath = this.puffinpath.computeFrenetFrames(this.segmentos, true).binormals;

    this.puffinAnimation = new TWEEN.Tween(origen).to(fin, tiempoDeRecorrido) .onUpdate(() => {
      var posicion = this.puffinpath.getPointAt(origen.t);
      var tangente = this.puffinpath.getTangentAt(origen.t);
      this.modifiedpuffin.position.copy(posicion);
      posicion.add(tangente);
      this.modifiedpuffin.up = this.binormales_puffinpath[Math.floor(origen.t * this.segmentos)];
      this.modifiedpuffin.lookAt(posicion);
    })
    .repeat(Infinity)
    .start();


    window.addEventListener("keydown", (event) => this.onKeyDown(event));
    window.addEventListener("keyup", (event) => this.onKeyUp(event));

    this.add(this.penwin);
    this.add (this.tube);
    this.add(this.modifiedpuffin);
    //this.add(this.penwin.getCamera());
  }  

  onKeyDown(event){
    if(event.key == "c" || event.key == "C"){
      if(this.thirdPerson){
        this.add(this.camera);
        this.cameraControl.enabled = true;
        this.thirdPerson = false;
      }
      else{
        this.remove(this.camera);
        this.thirdPerson = true;
        this.cameraControl.enabled = false;
      }
    }
    if(event.key == "a" || event.key == "A"){
      this.left = true;
    }
    if(event.key == "d" || event.key == "D"){
      this.right = true;
    }
  }

  onKeyUp(event){
    if(event.key == "a" || event.key == "A"){
      this.left = false;
    }
    if(event.key == "d" || event.key == "D"){
      this.right = false;
    }
  }

  createCamera () {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión vértical en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
    // También se indica dónde se coloca
    
    //Distancia
    /*this.camera.posction.set(2,2,25);
    // Y hacia dónde mira
    var look = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(look);*/
    this.cameraControl = new TrackballControls (this.camera, this.renderer.domElement);
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;

    this.camera.position.set(2,2,25);
    var look = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(look);

    this.cameraControl.enabled = false;
    this.thirdPerson = true;
    //this.add (this.camera);
    
    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita

    // Debe orbitar con respecto al punto de mira de la cámara
    //this.cameraControl.target = look;
  }
  
  createGround () {
    // El suelo es un Mesh, necesita una geometría y un material.
    
    // La geometría es una caja con muy poca altura
    var geometryGround = new THREE.BoxGeometry (0.5,0.02,0.5);
    
    // El material se hará con una textura de madera
    //var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
    var materialGround = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    // Ya se puede construir el Mesh
    var ground = new THREE.Mesh (geometryGround, materialGround);
    
    // Todas las figuras se crean centradas en el origen.
    // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
    ground.position.y = -0.01;
    
    // Que no se nos olvide añadirlo a la escena, que en este caso es  this
    this.add (ground);
  }

  createWall() {
    // La geometría es una caja con muy poca altura
    var geometryWall = new THREE.BoxGeometry (0.02,1,0.5);
    
    // El material se hará con una textura de madera
    //var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
    var materialWall = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    // Ya se puede construir el Mesh
    var wall = new THREE.Mesh (geometryWall, materialWall);
    
    // Todas las figuras se crean centradas en el origen.
    // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
    wall.position.x = -0.5;
    wall.position.y = 0.25;
    
    // Que no se nos olvide añadirlo a la escena, que en este caso es  this
    this.add (wall);
  }
  
  createGUI () {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();
    
    // La escena le va a añadir sus propios controles. 
    // Se definen mediante un objeto de control
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = {
      // En el contexto de una función   this   alude a la función
      lightPower : 100.0,  // La potencia de esta fuente de luz se mide en lúmenes
      ambientIntensity : 0.35,
      axisOnOff : true
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Luz y Ejes');
    
    // Se le añade un control para la potencia de la luz puntual
    folder.add (this.guiControls, 'lightPower', 0, 200, 10)
      .name('Luz puntual : ')
      .onChange ( (value) => this.setLightPower(value) );
    
    // Otro para la intensidad de la luz ambiental
    folder.add (this.guiControls, 'ambientIntensity', 0, 1, 0.05)
      .name('Luz ambiental: ')
      .onChange ( (value) => this.setAmbientIntensity(value) );
      
    // Y otro para mostrar u ocultar los ejes
    folder.add (this.guiControls, 'axisOnOff')
      .name ('Mostrar ejes : ')
      .onChange ( (value) => this.setAxisVisible (value) );
    
    return gui;
  }
  
  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
    // La añadimos a la escena
    this.add (this.ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.pointLight = new THREE.SpotLight( 0xffffff );
    this.pointLight.power = this.guiControls.lightPower;
    this.pointLight.position.set( 2, 1, 2 );
    this.add (this.pointLight);
  }
  
  setLightPower (valor) {
    this.pointLight.power = valor;
  }

  setAmbientIntensity (valor) {
    this.ambientLight.intensity = valor;
  }  
  
  setAxisVisible (valor) {
    this.axis.visible = valor;
  }
  
  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
    
    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();
    
    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    
    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  getCamera () {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    if(this.thirdPerson)
      return this.penwin.getCamera();
    else
      return this.camera;
  }
  
  setCameraAspect (ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }
    
  onWindowResize () {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    
    // Y también el tamaño del renderizador
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  update () {
    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render (this, this.getCamera());

    if(this.right)
      this.penwin.changeAngle(0.05);
    if(this.left)
      this.penwin.changeAngle(-0.05);
    //this.camera.position.copy(this.penwin.position);

    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl.update();
    // Se actualiza el resto del modelo
    this.penwin.update();
    this.puffin.update();
    //this.penwinAnimation.update();
    TWEEN.update();
    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())
  }
}


/// La función   main
$(function () {
  
  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");

  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener ("resize", () => scene.onWindowResize());
  
  // Que no se nos olvide, la primera visualización.
  scene.update();
});
