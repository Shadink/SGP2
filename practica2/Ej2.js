
import * as THREE from 'three'

class Figuras extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshStandardMaterial({color: 0x79D667});
    
    // A la base no se accede desde ningún método. Se almacena en una variable local del constructor
    var tamano = 0.15;   // 15 cm de largo. Las unidades son metros
    
    this.caja = new THREE.Mesh (new THREE.BoxGeometry (tamano, tamano, tamano), this.material);
    this.caja.position.set (0, 0, tamano*2);

    this.cono = new THREE.Mesh (new THREE.ConeGeometry (tamano/2, tamano, this.guiControls.conoRes), this.material);
    this.cono.position.set (tamano*2, tamano*2, tamano*2);

    this.cilindro = new THREE.Mesh (new THREE.CylinderGeometry (tamano/2, tamano/2, tamano, 3), this.material);
    this.cilindro.position.set (tamano*(-2), tamano*2, tamano*2);

    this.esfera = new THREE.Mesh (new THREE.SphereGeometry (tamano, 3, 3), this.material);
    this.esfera.position.set (tamano*2, tamano*(-2), tamano*(-2));

    this.toro = new THREE.Mesh (new THREE.TorusGeometry (tamano, tamano/2, 3, 3), this.material);
    this.toro.position.set (tamano*(-2), tamano*(-2), tamano*(-2));
    
    this.icosaedro = new THREE.Mesh (new THREE.IcosahedronGeometry (tamano, 0), this.material);
    this.icosaedro.position.set (0, 0, tamano*(-2));
    
    // Al nodo  this, Figuras, se le cuelgan como hijos las figuras
    this.add (this.caja);
    this.add (this.cono);
    this.add (this.cilindro);
    this.add (this.esfera);
    this.add (this.toro);
    this.add (this.icosaedro);
  }
  
  createGUI (gui,titleGui) {

    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      cajaX : 1.0,
      cajaY : 1.0,
      cajaZ : 1.0,

      conoAlt : 0.15*2,
      conoRes : 3,
      
      cilTop : 0.15/2,
      cilBottom: 0.15/2,
      cilAlt : 0.15,
      cilRes : 3,

      esfRadio : 0.15,
      esfResW : 3,
      esfResH : 3,

      torRadio : 0.15,
      torRadioT : 0.15/2,
      torRadioRes : 3,
      torRadioTRes : 3,

      icoRadio : 0.15,
      icoRes : 0,
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.cajaX = 1.0;
        this.guiControls.cajaY = 1.0;
        this.guiControls.cajaZ = 1.0;

        this.guiControls.conoAlt = 0.15;
        this.guiControls.conoRes = 3;

        this.guiControls.cilTop = 0.15/2;
        this.guiControls.cilBottom = 0.15/2;
        this.guiControls.cilAlt = 0.15;
        this.guiControls.cilRes = 3;

        this.guiControls.esfRadio = 0.15;
        this.guiControls.esfResW = 3;
        this.guiControls.esfResH = 3;

        this.guiControls.torRadio = 0.15;
        this.guiControls.torRadioT = 0.15/2;
        this.guiControls.torRadioRes = 3;
        this.guiControls.torRadioTRes = 3;

        this.guiControls.icoRadio = 0.15;
        this.guiControls.icoRes = 0;
      }
    } 
    
    // Sección para los controles de la caja
    var ctrls_caja = gui.addFolder ("Controles de la Caja");
    ctrls_caja.add (this.guiControls, 'cajaX', 0.1, 3.0, 0.01).name ('Tamaño X : ').listen();
    ctrls_caja.add (this.guiControls, 'cajaY', 0.1, 3.0, 0.01).name ('Tamaño Y : ').listen();
    ctrls_caja.add (this.guiControls, 'cajaZ', 0.1, 3.0, 0.01).name ('Tamaño Z : ').listen();

    // Sección para los controles del cono
    var ctrls_cono = gui.addFolder ("Controles del Cono");
    ctrls_cono.add(this.guiControls, 'conoAlt', 0.1, 0.4, 0.01).name ('Altura : ').onChange((v) => this.updateCone());
    ctrls_cono.add(this.guiControls, 'conoRes', 3, 25, 1).name ('Resolución : ').onChange((v) => this.updateCone());

    // Sección para los controles del cilindro
    var ctrls_cilindro = gui.addFolder ("Controles del Cilindro");
    ctrls_cilindro.add(this.guiControls, 'cilTop', 0.01, 0.3, 0.01).name ('Radio Superior : ').onChange((v) => this.updateCylinder());
    ctrls_cilindro.add(this.guiControls, 'cilBottom', 0.01, 0.3, 0.01).name ('Radio Inferior : ').onChange((v) => this.updateCylinder());
    ctrls_cilindro.add(this.guiControls, 'cilAlt', 0.01, 0.3, 0.01).name ('Altura : ').onChange((v) => this.updateCylinder());
    ctrls_cilindro.add(this.guiControls, 'cilRes', 3, 25, 1).name ('Resolución : ').onChange((v) => this.updateCylinder());

    // Sección para los controles de la esfera
    var ctrls_esfera = gui.addFolder ("Controles de la Esfera");
    ctrls_esfera.add(this.guiControls, 'esfRadio', 0.01, 0.3, 0.01).name ('Radio : ').onChange((v) => this.updateSphere());
    ctrls_esfera.add(this.guiControls, 'esfResW', 3, 25, 1).name ('Segmentos Horizontales : ').onChange((v) => this.updateSphere());
    ctrls_esfera.add(this.guiControls, 'esfResH', 3, 25, 1).name ('Segmentos Verticales : ').onChange((v) => this.updateSphere());

    // Sección para los controles del toro
    var ctrls_toro = gui.addFolder ("Controles del Toro");
    ctrls_toro.add(this.guiControls, 'torRadio', 0.15, 0.3, 0.01).name ('Radio : ').onChange((v) => this.updateTorus());
    ctrls_toro.add(this.guiControls, 'torRadioT', 0.01, 0.3, 0.01).name ('Radio del Tubo : ').onChange((v) => this.updateTorus());
    ctrls_toro.add(this.guiControls, 'torRadioRes', 3, 25, 1).name ('Resolución del Tubo : ').onChange((v) => this.updateTorus());
    ctrls_toro.add(this.guiControls, 'torRadioTRes', 3, 25, 1).name ('Resolución : ').onChange((v) => this.updateTorus());

    // Sección para los controles del icosaedro
    var ctrls_ico = gui.addFolder ("Controles del Icosaedro");
    ctrls_ico.add(this.guiControls, 'icoRadio', 0.15, 0.3, 0.01).name ('Radio : ').onChange((v) => this.updateIco());
    ctrls_ico.add(this.guiControls, 'icoRes', 0, 5, 1).name ('Detalle : ').onChange((v) => this.updateIco());

    //Resetear
    var reset = gui.addFolder ("Resetear");
    reset.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  update () {
    this.caja.rotation.y += 0.01;
    this.caja.scale.set (this.guiControls.cajaX, this.guiControls.cajaY, this.guiControls.cajaZ);

    this.cilindro.rotation.y -= 0.01;

    this.cono.rotation.y += 0.01;

    this.toro.rotation.y +=0.01;
    this.esfera.rotation.y -= 0.01;
    this.icosaedro.rotation.y +=0.01;
  }

  updateCone(){

    this.remove(this.cono);
    this.cono = new THREE.Mesh (new THREE.ConeGeometry (0.15/2, this.guiControls.conoAlt, this.guiControls.conoRes), this.material);
    this.cono.position.set (0.15*2, 0.15*2, 0.15*2);
    this.add(this.cono);

  }

  updateCylinder(){
    
    this.remove(this.cilindro);
    this.cilindro = new THREE.Mesh (new THREE.CylinderGeometry (this.guiControls.cilTop, this.guiControls.cilBottom, this.guiControls.cilAlt, this.guiControls.cilRes), this.material);
    this.cilindro.position.set (-0.3, 0.3, 0.3);
    this.add(this.cilindro);

  }

  updateSphere(){

    this.remove(this.esfera);
    this.esfera = new THREE.Mesh (new THREE.SphereGeometry (this.guiControls.esfRadio, this.guiControls.esfResW, this.guiControls.esfResH), this.material);
    this.esfera.position.set (0.3, -0.3, -0.3);
    this.add(this.esfera);

  }

  updateTorus(){

    this.remove(this.toro);
    this.toro = new THREE.Mesh (new THREE.TorusGeometry (this.guiControls.torRadio, this.guiControls.torRadioT, this.guiControls.torRadioRes, this.guiControls.torRadioTRes), this.material);
    this.toro.position.set (-0.3, -0.3, -0.3);
    this.add(this.toro);

  }

  updateIco(){
    this.remove(this.icosaedro);
    this.icosaedro = new THREE.Mesh (new THREE.IcosahedronGeometry (this.guiControls.icoRadio, this.guiControls.icoRes), this.material);
    this.icosaedro.position.set (0, 0, -0.3);
    this.add(this.icosaedro);
  }

}

export { Figuras }
