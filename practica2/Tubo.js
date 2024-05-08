
import * as THREE from 'three'

class Tubo extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    //this.createGUI(gui,titleGui);
    
    this.circle = new THREE.Shape();

    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshNormalMaterial();

    this.pts = [new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(2, 0, 0),
      new THREE.Vector3(3, -2, 1),
      new THREE.Vector3(5, -1, 0.5),
      new THREE.Vector3(6, 1, 2),
      new THREE.Vector3(4, 6, -3),
      new THREE.Vector3(3.5, 4, -5),
      new THREE.Vector3(4, 1, -2),
      new THREE.Vector3(-3, -5, -4),
      new THREE.Vector3(-5, 1, -5),
      new THREE.Vector3(-3, 2, -6),
      new THREE.Vector3(0, 6, -6),
      new THREE.Vector3(-3, 8, -10),
      new THREE.Vector3(-5, 4, -10),
      new THREE.Vector3(-5, -7, -5),
      new THREE.Vector3(-3, -8, -2),
      new THREE.Vector3(-2, -5, 0),
      ];

    this.tubepath = new THREE.CatmullRomCurve3(this.pts, true);
    var res = 200;
    var radio = 0.5;
    var segmentos = 20;
    var tubogeo = new THREE.TubeGeometry(this.tubepath, res, radio, segmentos, true);

    this.tubo = new THREE.Mesh(tubogeo, this.material);

    this.add(this.tubo);
  }
  
  createGUI (gui,titleGui) {

    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {

      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {

      }
    } 

    //Resetear
    var reset = gui.addFolder ("Resetear");
    reset.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  update () {

  }

}

export { Tubo }
