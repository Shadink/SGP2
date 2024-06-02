
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

    // Puntos
    this.CLION_PTS = -50;
    this.FISH_PTS = 20;
    this.SARDINE_PTS = 10;
    this.MFISH_PTS = 50;
    this.PUFFIN_PTS = 100;

    // Power
    this.FISH_POWER = 2;
    this.SARDINE_POWER = 5;
    this.MFISH_POWER = 1;

    this.myCanvas = myCanvas;
    this.right = false;
    this.left = false;
    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);
    
    // Se crea la interfaz gráfica de usuario
    //this.gui = this.createGUI ();
    this.thirdPerson = true;
    this.pickRequested = false;
    this.isPowerActive = false;
    this.fishLightCount = 0;

    // Puntos
    this.points = 0;
    this.pointsDisplay = document.getElementById('points-display');

    // Poder
    this.power = 0;
    this.powerDisplay = document.getElementById('power-display');

    // Vueltas
    this.laps = 0;
    this.lapsDisplay = document.getElementById('laps-display');
    // Construimos los distinos elementos que tendremos en la escena

    // El modelo puede incluir su parte de la interfaz gráfica de usuario. Le pasamos la referencia a 
    // la gui y el texto bajo el que se agruparán los controles de la interfaz que añada el modelo.
    this.tube = new Tubo(this.gui, "");
    this.fish = new Fish(this.gui, "");
    this.fish2 = new Fish(this.gui, "");
    this.fish3 = new Fish(this.gui, "");
    this.fish4 = new Fish(this.gui, "");
    this.fish5 = new Fish(this.gui, "");
    this.penwin = new Penwin(this.gui, "");
    this.clion = new SeaLion(this.gui, "");
    this.clion2 = new SeaLion(this.gui, "");
    this.clion3 = new SeaLion(this.gui, "");
    this.puffin = new Puffin(this.gui, "");
    this.puffin2 = new Puffin(this.gui, "");
    this.mfish = new MoonFish(this.gui, "");
    this.mfish2 = new MoonFish(this.gui, "");
    this.mfish3 = new MoonFish(this.gui, "");
    this.sardine = new Sardine(this.gui, "");
    this.sardine2 = new Sardine(this.gui, "");
    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(variable)

    this.createSkybox();

    this.createCamera ();
    
    // Variables picking
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    this.puffin1path_pts = [
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(-4, 0, 0),
      new THREE.Vector3(-4, 3, -4),
      ];

    this.puffin1path = new THREE.CatmullRomCurve3(this.puffin1path_pts, true);

    this.puffin2path_pts = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(4, 0, 0),
      new THREE.Vector3(4, -3, 4),
      ];

    this.puffin2path = new THREE.CatmullRomCurve3(this.puffin2path_pts, true);
    
    // Poner fishes
    this.fish.position.set(2, 0.75, 0);
    this.fish.scale.set(0.25, 0.25, 0.25);

    this.fish2.position.set(4, 1, -1.25);
    this.fish2.rotation.x = (90 * Math.PI) / 180;
    this.fish2.scale.set(0.25, 0.25, 0.25);

    this.fish3.position.set(-5, 1, -6);
    this.fish3.rotation.x = (-90 * Math.PI) / 180;
    this.fish3.scale.set(0.25, 0.25, 0.25);

    this.fish4.position.set(-5, 0, -9.5);
    this.fish4.rotation.x = (-135 * Math.PI) / 180;
    this.fish4.scale.set(0.25, 0.25, 0.25);

    this.fish5.position.set(-5, -6, -5);
    this.fish5.rotation.x = (-135 * Math.PI) / 180;
    this.fish5.rotation.z = (180 * Math.PI) / 180;
    this.fish5.scale.set(0.25, 0.25, 0.25);

    this.sardine.position.set(5, 0, 1);
    this.sardine.scale.set(0.25, 0.25, 0.25);

    this.sardine2.position.set(-3, 7, -10);
    this.sardine2.rotation.x = (-90 * Math.PI) / 180;
    this.sardine2.scale.set(0.25, 0.25, 0.25);

    this.mfish.position.set(4, 7, -3);
    this.mfish.scale.set(0.25, 0.25, 0.25);
    this.mfish.rotation.y = (90 * Math.PI) / 180;

    this.mfish2.position.set(-3, -4, -4);
    this.mfish2.scale.set(0.25, 0.25, 0.25);

    this.mfish3.position.set(-0.5, 7.75, -6.75);
    this.mfish3.scale.set(0.25, 0.25, 0.25);
    // Poner sealions
    this.clion.position.set(6, 1.15, 1.75);
    this.clion.rotation.y = (280 * Math.PI) / 180;
    this.clion.rotation.x = (45 * Math.PI) / 180;

    this.clion2.position.set(0, 5.75, -6);
    this.clion2.rotation.y = (280 * Math.PI) / 180;

    this.clion3.position.set(-3, -7.8, -2);
    this.clion3.rotation.x = (180 * Math.PI) / 180;
    this.clion3.rotation.y = (225 * Math.PI) / 180;

    // Crear las luces
    this.createLights ();
    
    // Tendremos una cámara con un control de movimiento con el ratón
    
    // Un suelo 
    //this.createGround ();

    //this.createWall ();
    
    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    // Todas las unidades están en metros
    /*this.axis = new THREE.AxesHelper (0.1);
    this.add (this.axis);*/

    // Definir animaciones
    this.segmentos = 100;
    this.binormales_tubepath = this.tube.tubepath.computeFrenetFrames(this.segmentos, true).binormals;

    this.origen = {t : 0};
    this.fin = {t : 1};
    this.penwinTiempoDeRecorrido = 30000;

    this.createPenwinAnimation();

    this.binormales_puffin1path = this.puffin1path.computeFrenetFrames(this.segmentos, true).binormals;
    this.binormales_puffin2path = this.puffin2path.computeFrenetFrames(this.segmentos, true).binormals;

    this.puffinTiempoDeRecorrido = 30000;

    this.puffin1Animation = new TWEEN.Tween(this.origen).to(this.fin, this.puffinTiempoDeRecorrido) .onUpdate(() => {
      var posicion = this.puffin1path.getPointAt(this.origen.t);
      var tangente = this.puffin1path.getTangentAt(this.origen.t);
      this.puffin.position.copy(posicion);
      posicion.add(tangente);
      this.puffin.up = this.binormales_puffin1path[Math.floor(this.origen.t * this.segmentos)];
      this.puffin.lookAt(posicion);
    })
    .repeat(Infinity)
    .start();

    this.puffin2Animation = new TWEEN.Tween(this.origen).to(this.fin, this.puffinTiempoDeRecorrido) .onUpdate(() => {
      var posicion = this.puffin2path.getPointAt(this.origen.t);
      var tangente = this.puffin2path.getTangentAt(this.origen.t);
      this.puffin2.position.copy(posicion);
      posicion.add(tangente);
      this.puffin2.up = this.binormales_puffin2path[Math.floor(this.origen.t * this.segmentos)];
      this.puffin2.lookAt(posicion);
    })
    .repeat(Infinity)
    .start();


    window.addEventListener("keydown", (event) => this.onKeyDown(event));
    window.addEventListener("keyup", (event) => this.onKeyUp(event));
    window.addEventListener("mousedown", (event) => this.onDocumentMouseDown(event));

    this.objects = [
      this.penwin,
      this.fish,
      this.fish2,
      this.fish3,
      this.fish4,
      this.fish5,
      this.mfish,
      this.mfish2,
      this.mfish3,
      this.sardine,
      this.sardine2,
      //this.puffin,
      this.clion,
      this.clion2,
      this.clion3
    ]

    this.fishList = [
      this.fish,
      this.fish2,
      this.fish3,
      this.fish4,
      this.fish5,
      this.mfish,
      this.mfish2,
      this.mfish3,
      this.sardine,
      this.sardine2
    ]

    this.pickableObjects = [
      this.puffin,
      this.puffin2
    ]

    // Crear bounding boxes para los objetos
    for (let key in this.objects) {
      let object = this.objects[key];
      object.boundingBox = new THREE.Box3().setFromObject(object);
    }

    this.add(this.penwin);
    this.add (this.tube);
    this.add(this.puffin);
    this.add(this.puffin2);
    this.add(this.fish);
    this.add(this.fish2);
    this.add(this.fish3);
    this.add(this.fish4);
    this.add(this.fish5);
    this.add(this.clion);
    this.add(this.clion2);
    this.add(this.clion3);
    this.add(this.sardine);
    this.add(this.sardine2);
    this.add(this.mfish3);
    this.add(this.mfish);
    this.add(this.mfish2);
    //this.add(this.penwin.getCamera());
    
  }  
  createSkybox() {
    const loader = new THREE.CubeTextureLoader();
    loader.setPath('textures/');

    const textureCube = loader.load([
      'bg-side1.png', 'bg-side2.png',

      //Arriba
      'bg-sky.png', 
      //Abajo
      'bg-water.png',

      'bg-side1.png', 'bg-side2.png'
    ]);

    this.background = textureCube;
  }

    // Animation

    createPenwinAnimation(){
      this.penwinAnimation = new TWEEN.Tween(this.origen).to(this.fin, this.penwinTiempoDeRecorrido) .onUpdate(() => {
        var posicion = this.tube.tubepath.getPointAt(this.origen.t);
        var tangente = this.tube.tubepath.getTangentAt(this.origen.t);
        this.penwin.position.copy(posicion);
        posicion.add(tangente);
        this.penwin.up = this.binormales_tubepath[Math.floor(this.origen.t * this.segmentos)];
        this.penwin.lookAt(posicion);
      })
      .repeat(Infinity)
      .onRepeat(() => {
        this.respawnFish();
        this.penwinTiempoDeRecorrido *= 0.9;
        this.laps+=1;
        this.lapsDisplay.textContent = `Vueltas: ${this.laps}`;
        this.penwinAnimation.duration(this.penwinTiempoDeRecorrido); // Actualizar la duración de la animación existente
      })
      .start();
    }
  
    respawnFish(){
      for(let key in this.fishList){
        let object = this.objects[key];
        if(object.collided){
          this.add(object);
          object.collided = false;
        }
      }
    }

    // Colisiones

  collisionAction(object){
    switch(object.constructor.name){
      case('SeaLion'):
        if(!this.penwin.isHurt() && !this.isPowerActive){
          //this.penwinAnimation.duration(this.penwinTiempoDeRecorrido * 1.5);
          this.penwin.hurtPenwin();
          this.updatePoints(this.CLION_PTS);
        }
        break;
      case('Fish'):
        this.anadirPuntos(this.FISH_PTS, object, this.FISH_POWER);
        break;
      case('Sardine'):
        this.anadirPuntos(this.SARDINE_PTS, object, this.SARDINE_POWER);
      case('MoonFish'):
        this.anadirPuntos(this.MFISH_PTS, object, this.MFISH_POWER);
    }
  }

  updatePower(nPower){
    this.power += nPower;
    if(this.power >= 10){
      this.power = 10;
      this.isPowerActive = true;
      this.penwin.bonusAnimOn();
    }
    this.powerDisplay.textContent = `POWER: ${this.power}`;
  }

  updatePoints(nPoints){
    this.points += nPoints;
    if(this.points < 0)
      this.points = 0;
    this.pointsDisplay.textContent = `Puntos: ${this.points}`;
  }

  anadirPuntos(nPoints, object, power){
    if (!object.collided) {
      this.updatePoints(nPoints);
      this.updatePower(power);
      console.log(this.points);
      object.collided = true;
      this.remove(object);
    }
  }

  checkCollisions() {
    this.penwin.boundingBox.setFromObject(this.penwin);

    for (let key in this.objects) {
      let object = this.objects[key];
      if (this.penwin !== object) { // No comprobar colisión con sí mismo
        object.boundingBox.setFromObject(object);
        if (this.penwin.boundingBox.intersectsBox(object.boundingBox)) {
          this.collisionAction(object);
        }
      }
    }
  }

  //Pick

  onDocumentMouseDown(event){
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = 1 - 2 * (event.clientY / window.innerHeight);

      this.raycaster.setFromCamera(this.mouse, this.getCamera());

      var pickedObjects = this.raycaster.intersectObjects(this.pickableObjects, true);
      
      if(pickedObjects.length > 0){
        //selectedObject = pickedObjects[0].object;
        this.updatePoints(this.PUFFIN_PTS);
      }
  }

  /*getCanvasRelativePosition(event){
    const rect = this.myCanvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * this.myCanvas.width  / rect.width,
      y: (event.clientY - rect.top ) * this.myCanvas.height / rect.height,
    };
  }
  setPickPosition(event){
    const pos = this.getCanvasRelativePosition(event);
    this.pickPosition.x = (pos.x / this.myCanvas.width ) *  2 - 1;
    this.pickPosition.y = (pos.y / this.myCanvas.height) * -2 + 1;  // note we flip Y

  }*/

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
    
    // Todas las figuras se crean centradas en el this.origen.
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
  
  
  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    this.ambientLight = new THREE.AmbientLight(0xf0bdc5, 2);
    this.add (this.ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1).normalize();
    this.add(directionalLight);
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
    this.puffin2.update();
    this.clion.update();
    this.clion2.update();
    this.clion3.update();
    this.fish.update();
    this.fish2.update();
    this.fish3.update();
    this.fish4.update();
    this.fish5.update();
    this.mfish.update();
    this.mfish2.update();
    this.mfish3.update();
    this.sardine.update();
    this.sardine2.update();

    if(this.isPowerActive){
      this.fishLightCount += 1;
      if(this.fishLightCount == 50){
        this.power -= 1;
        this.powerDisplay.textContent = `POWER: ${this.power}`;
        if(this.power == 0){
          this.isPowerActive = false;
          this.penwin.bonusAnimOff();
        }
        this.fishLightCount = 0;
      }
    }

    this.checkCollisions();

    /*if (this.pickRequested) {
      this.pickHelper.pick(this.pickPosition, this, this.camera);
      this.pickRequested = false;
    }*/
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
  var scene = new MyScene(document.querySelector("#WebGL-output"));

  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener ("resize", () => scene.onWindowResize());
  
  // Que no se nos olvide, la primera visualización.
  scene.update();
});
