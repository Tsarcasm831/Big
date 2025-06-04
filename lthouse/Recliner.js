// NEW FILE: Recliner.js
import * as THREE from 'three';

class Recliner {
    constructor(game) {
        this.game = game;
    }

    createRecliner(x, y, z) {
        // Create a basic recliner model composed of a seat, backrest, and armrest
        // Seat
        const seatGeometry = new THREE.BoxGeometry(1.0, 0.2, 1.0);
        const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
        const seat = new THREE.Mesh(seatGeometry, seatMaterial);
        seat.position.set(x, y + 0.2, z);
        seat.castShadow = true;
        seat.receiveShadow = true;
        this.game.scene.add(seat);
        this.game.colliders.push(seat);

        // Backrest (slightly tilted)
        const backGeometry = new THREE.BoxGeometry(1.0, 0.8, 0.2);
        const backMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
        const back = new THREE.Mesh(backGeometry, backMaterial);
        back.position.set(x, y + 0.7, z - 0.4);
        back.rotation.x = -Math.PI / 12; // slight tilt backward
        back.castShadow = true;
        back.receiveShadow = true;
        this.game.scene.add(back);
        this.game.colliders.push(back);

        // Armrest (left side)
        const armGeometry = new THREE.BoxGeometry(0.2, 0.4, 1.0);
        const armMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
        const arm = new THREE.Mesh(armGeometry, armMaterial);
        arm.position.set(x - 0.6, y + 0.4, z);
        arm.castShadow = true;
        arm.receiveShadow = true;
        this.game.scene.add(arm);
        this.game.colliders.push(arm);

        // Make the recliner interactable (using the seat as trigger)
        seat.userData = {
            interactable: true,
            type: 'recliner',
            interaction: () => {
                this.game.showSarcasmMessage('A recliner fit for the king of sarcasm—time to sink into utter relaxation.');
            }
        };
        this.game.interactableObjects.push(seat);
    }
}

export { Recliner };