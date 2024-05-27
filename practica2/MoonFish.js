
import * as THREE from 'three'

class MoonFish extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    //this.createGUI(gui,titleGui);
    
    const scaletexture = new THREE.TextureLoader().load( "textures/fish_scales.jpg" );
    scaletexture.wrapS = THREE.RepeatWrapping;
    scaletexture.wrapT = THREE.RepeatWrapping;
    scaletexture.repeat.set( 0.2, 0.2 );

    const scalebumptexture = new THREE.TextureLoader().load( "textures/fish_scalesbump.jpg" );
    scalebumptexture.wrapS = THREE.RepeatWrapping;
    scalebumptexture.wrapT = THREE.RepeatWrapping;
    scalebumptexture.repeat.set( 0.2, 0.2 );

    this.blackmaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.material = new THREE.MeshStandardMaterial({ color: 0x566A7D, map: scaletexture, bumpMap: scalebumptexture });

    this.shape = new THREE.Shape();

    this.shape.moveTo(-3, 0);
    this.shape.lineTo(-5, 3);
    this.shape.lineTo(-2, 4);
    this.shape.lineTo(1, 6);
    this.shape.lineTo(1, 4);
    this.shape.lineTo(3, 2);
    this.shape.lineTo(4, 0.5);
    this.shape.lineTo(6, 4);
    this.shape.lineTo(5, 0);
    this.shape.lineTo(6, -4);
    this.shape.lineTo(4, -0.5);
    this.shape.lineTo(3, -2);
    this.shape.lineTo(1, -4);
    this.shape.lineTo(1, -6);
    this.shape.lineTo(-2, -4);
    this.shape.lineTo(-5, -3);
    this.shape.lineTo(-3, 0);

    this.options = { depth: 1, steps: 1, bevelEnabled: false};
    this.fishgeo = new THREE.ExtrudeGeometry(this.shape, this.options);
    this.fish = new THREE.Mesh(this.fishgeo, this.material);
    this.fish.scale.set(0.25, 0.25, 0.25);
    this.fish.rotation.y = (90 * Math.PI) / 180;

    // Little eyes
    this.eyegeo = new THREE.SphereGeometry(0.05, 5, 5);
    this.eye1 = new THREE.Mesh(this.eyegeo, this.blackmaterial);
    this.eye1.position.set(0, 0.5, 0.7);    
    this.eye2 = new THREE.Mesh(this.eyegeo, this.blackmaterial);
    this.eye2.position.set(0.25, 0.5, 0.7); 

    this.add(this.fish);
    this.add(this.eye1);
    this.add(this.eye2);
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

export { MoonFish }
