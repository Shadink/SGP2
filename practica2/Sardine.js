
import * as THREE from 'three'

class Sardine extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    //this.createGUI(gui,titleGui);
    
    this.shape = new THREE.Shape();

    this.material = new THREE.MeshBasicMaterial({ color: 0x3D3938 });

    this.shape.moveTo(-7, 0);
    this.shape.lineTo(-8,1);
    this.shape.lineTo(-3,2);
    this.shape.lineTo(3,2);
    this.shape.lineTo(8,0.5);
    this.shape.lineTo(10,2);
    this.shape.lineTo(9,0);
    this.shape.lineTo(10,-2);
    this.shape.lineTo(8,-0.5);
    this.shape.lineTo(3,-2);
    this.shape.lineTo(-3,-2);
    this.shape.lineTo(-8,-1);
    this.shape.lineTo(-7,0);

    this.options = { depth: 0.4, steps: 1, bevelEnabled: false};
    this.fishgeo = new THREE.ExtrudeGeometry(this.shape, this.options);
    this.fish = new THREE.Mesh(this.fishgeo, this.material);
    this.fish.rotation.y = (90 * Math.PI) / 180;
    this.fish.scale.set(0.05, 0.05, 0.05);


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

export { Sardine }
