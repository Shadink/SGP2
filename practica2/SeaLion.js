
import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'

class SeaLion extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    //this.createGUI(gui,titleGui);
    

    this.blackmaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.yellowmaterial = new THREE.MeshBasicMaterial( { color: 0xFFFA6B });
    this.brownmaterial = new THREE.MeshBasicMaterial( { color : 0x572F0E });

    // Head
    this.headgeo = new THREE.SphereGeometry(0.25, 20, 20);
    this.head = new THREE.Mesh(this.headgeo, this.brownmaterial);
    this.head.position.set(0, 0.5, 0);

    // Torso
    this.torsogeo = new THREE.CylinderGeometry(0.25, 0.25, 1, 20);
    this.torso = new THREE.Mesh(this.torsogeo, this.brownmaterial);
    
    // Snoutté
    this.snoutgeo = new THREE.CylinderGeometry(0.05, 0.05, 0.15, 10);
    this.snout = new THREE.Mesh(this.snoutgeo, this.brownmaterial);
    this.snout.position.set(0.25, 0.5, 0);
    this.snout.rotation.z = (90 * Math.PI) / 180; // Chapuza porque no funciona rotación con radianes

    // Nose
    this.nosegeo = new THREE.SphereGeometry(0.02, 5, 5);
    this.nose = new THREE.Mesh(this.nosegeo, this.blackmaterial);
    this.nose.position.set(0.325, 0.52, 0);    

    // Little eyes
    this.eyegeo = new THREE.SphereGeometry(0.02, 5, 5);
    this.eye1 = new THREE.Mesh(this.eyegeo, this.blackmaterial);
    this.eye1.position.set(0.2, 0.6, -0.1);    
    this.eye2 = new THREE.Mesh(this.eyegeo, this.blackmaterial);
    this.eye2.position.set(0.2, 0.6, 0.1);    

    // Whiskers
    this.whiskergeo = new THREE.CylinderGeometry(0.01, 0.01, 0.15, 10);
    this.whisker1 = new THREE.Mesh(this.whiskergeo, this.blackmaterial);
    this.whisker1.position.set(0.325, 0.52, -0.1);
    this.whisker1.rotation.x = (90 * Math.PI) / 180;
    this.whisker2 = new THREE.Mesh(this.whiskergeo, this.blackmaterial);
    this.whisker2.position.set(0.325, 0.52, 0.1);
    this.whisker2.rotation.x = (90 * Math.PI) / 180;
    this.whisker3 = new THREE.Mesh(this.whiskergeo, this.blackmaterial);
    this.whisker3.position.set(0.325, 0.5, -0.1);
    this.whisker3.rotation.x = (70 * Math.PI) / 180;
    this.whisker4 = new THREE.Mesh(this.whiskergeo, this.blackmaterial);
    this.whisker4.position.set(0.325, 0.5, 0.1);
    this.whisker4.rotation.x = (-70 * Math.PI) / 180;
    this.whisker5 = new THREE.Mesh(this.whiskergeo, this.blackmaterial);
    this.whisker5.position.set(0.325, 0.54, -0.1);
    this.whisker5.rotation.x = (-70 * Math.PI) / 180;
    this.whisker6 = new THREE.Mesh(this.whiskergeo, this.blackmaterial);
    this.whisker6.position.set(0.325, 0.54, 0.1);
    this.whisker6.rotation.x = (70 * Math.PI) / 180;

    // Flippers
    this.flippergeo = new THREE.BoxGeometry(0.05, 0.2, 0.5);
    this.flipper1 = new THREE.Mesh(this.flippergeo, this.brownmaterial);
    this.flipper1.position.set(0, 0.3, 0.4);
    this.flipper1.rotation.x = (-45 * Math.PI) / 180;
    this.flipper2 = new THREE.Mesh(this.flippergeo, this.brownmaterial);
    this.flipper2.position.set(0, 0.3, -0.4);
    this.flipper2.rotation.x = (45 * Math.PI) / 180;


    this.add(this.head);
    this.add(this.torso);
    this.add(this.snout);
    this.add(this.nose);
    this.add(this.eye1);
    this.add(this.eye2);
    this.add(this.whisker1);
    this.add(this.whisker2);
    this.add(this.whisker3);
    this.add(this.whisker4);
    this.add(this.whisker5);
    this.add(this.whisker6);
    this.add(this.flipper1);
    this.add(this.flipper2);


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

export { SeaLion }
