
import * as THREE from 'three'

class Fish extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    //this.createGUI(gui,titleGui);
    
    this.shape = new THREE.Shape();

    this.material = new THREE.MeshNormalMaterial();

    this.shape.moveTo(0.3, 0);
    this.shape.lineTo(0.5,0.2);
    this.shape.quadraticCurveTo(0.2, 0.35, -0.1, 0.4);
    this.shape.quadraticCurveTo(-0.3, 0.3, -0.5, 0.1);
    this.shape.quadraticCurveTo(-0.6, 0.3, -0.9, 0.4);
    this.shape.quadraticCurveTo(-0.8, 0.2, -0.7, 0);
    this.shape.quadraticCurveTo(-0.8, -0.2, -0.9, -0.4);
    this.shape.quadraticCurveTo(-0.6, -0.3, -0.5, -0.1);
    this.shape.quadraticCurveTo(-0.3,-0.3, -0.1, -0.4);
    this.shape.quadraticCurveTo(0.2, -0.35, 0.5, -0.2);
    this.shape.lineTo(0.3, 0);

    this.options = { depth: 0.2, steps: 1, bevelEnabled: false};
    this.fishgeo = new THREE.ExtrudeGeometry(this.shape, this.options);
    this.fish = new THREE.Mesh(this.fishgeo, this.material);

    this.add(this.fish);
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

export { Fish }
