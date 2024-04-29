
import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'

class Puffin extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    //this.createGUI(gui,titleGui);
    

    this.blackmaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.orangematerial = new THREE.MeshBasicMaterial( { color: 0xF7A80A });
    this.whitematerial = new THREE.MeshBasicMaterial( { color : 0xFFFFFF });

    // Head
    this.headgeo = new THREE.SphereGeometry(0.1, 20, 20);
    this.head = new THREE.Mesh(this.headgeo, this.whitematerial);
    this.head.position.set(0, 0.4, 0);

    // Beak
    this.beakgeo = new THREE.CylinderGeometry(0.05, 0, 0.15, 10);
    this.beak = new THREE.Mesh(this.beakgeo, this.orangematerial);
    this.beak.position.set(0.125, 0.4, 0);
    this.beak.scale.set(1, 0.5, 0.5);
    this.beak.rotation.z = (90 * Math.PI) / 180;

    // Eyes
    this.eyegeo = new THREE.SphereGeometry(0.01, 10, 10);
    this.eye = new THREE.Mesh(this.eyegeo, this.blackmaterial);
    this.eye.position.set(0.09, 0.45, 0.05);
    this.eye2 = new THREE.Mesh(this.eyegeo, this.blackmaterial);
    this.eye2.position.set(0.09, 0.45, -0.05);

    // Neck
    this.neckgeo = new THREE.TorusGeometry(0.05, 0.01, 9, 9);
    this.neck = new THREE.Mesh(this.neckgeo, this.blackmaterial);
    this.neck.position.set(0, 0.3, 0);
    this.neck.rotation.x = (90 * Math.PI) / 180;

    // Body
    this.bodygeo = new THREE.SphereGeometry(0.3, 10, 20);
    this.body = new THREE.Mesh(this.bodygeo, this.whitematerial);
    this.body.scale.set(0.5, 1, 0.5);

    this.add(this.head);
    this.add(this.beak);
    this.add(this.eye);
    this.add(this.eye2);
    this.add(this.body);
    this.add(this.neck);

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

export { Puffin }
