
import * as THREE from 'three'

class Fish extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    this.collided = false;
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    //this.createGUI(gui,titleGui);
    const scaletexture = new THREE.TextureLoader().load( "textures/fish_scales.jpg" );
    scaletexture.wrapS = THREE.RepeatWrapping;
    scaletexture.wrapT = THREE.RepeatWrapping;
    scaletexture.repeat.set( 1, 1 );

    const scalebumptexture = new THREE.TextureLoader().load( "textures/fish_scalesbump.jpg" );
    scalebumptexture.wrapS = THREE.RepeatWrapping;
    scalebumptexture.wrapT = THREE.RepeatWrapping;
    scalebumptexture.repeat.set( 1, 1 );

    this.blackmaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.material = new THREE.MeshStandardMaterial({ color: 0xA39D9B, map: scaletexture, bumpMap: scalebumptexture,  bumpScale : 1});

    this.shape = new THREE.Shape();

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
    this.fish.rotation.y = (90 * Math.PI) / 180;

    // Little eyes
    this.eyegeo = new THREE.SphereGeometry(0.05, 5, 5);
    this.eye1 = new THREE.Mesh(this.eyegeo, this.blackmaterial);
    this.eye1.position.set(0, 0.2, 0);    
    this.eye2 = new THREE.Mesh(this.eyegeo, this.blackmaterial);
    this.eye2.position.set(0.2, 0.2, 0); 

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

export { Fish }
