/**
 * Furniture.js
 * 
 * Handles the creation of furniture items like the bookshelf, desk, armchair, bed, and picture frame.
 * Creates all interactive and decorative objects in the scene.
 */
import * as THREE from 'three';

class Furniture {
    constructor(game) {
        this.game = game;
    }

    createBookshelf(x, y, z) {
        // Bookshelf base
        const shelfGeometry = new THREE.BoxGeometry(0.4, 2.5, 2);
        // Replace external texture with a color
        const woodMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const bookshelf = new THREE.Mesh(shelfGeometry, woodMaterial);
        bookshelf.position.set(x, y + 1.25, z);
        bookshelf.castShadow = true;
        bookshelf.receiveShadow = true;
        this.game.scene.add(bookshelf);
        this.game.colliders.push(bookshelf);
        
        // Add shelves
        for (let i = 1; i < 3; i++) {
            const shelfBoard = new THREE.BoxGeometry(0.4, 0.05, 2);
            const shelf = new THREE.Mesh(shelfBoard, woodMaterial);
            shelf.position.set(x, y + i * 0.8, z);
            shelf.castShadow = true;
            shelf.receiveShadow = true;
            this.game.scene.add(shelf);
        }
        
        // Make bookshelf interactable
        bookshelf.userData = {
            interactable: true,
            type: 'bookshelf',
            interaction: () => {
                this.game.showSarcasmMessage('Done with your literary masterpieces? Or just browsing the collected works of an intellectual superior?');
                if (this.game.sounds.bookshelfSound) {
                    this.game.sounds.bookshelfSound.play();
                }
            }
        };
        this.game.interactableObjects.push(bookshelf);
    }

    createBooks(x, y, z) {
        // Create several books with different colors
        const bookColors = [0x8B4513, 0x654321, 0x8B0000, 0x191970, 0x006400];
        const bookGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.3);
        
        for (let i = 0; i < 8; i++) {
            const bookMaterial = new THREE.MeshStandardMaterial({ 
                color: bookColors[i % bookColors.length],
                roughness: 0.8,
                metalness: 0.1
            });
            
            const book = new THREE.Mesh(bookGeometry, bookMaterial);
            book.position.set(x - 0.8 + i * 0.2, y, z);
            book.castShadow = true;
            book.receiveShadow = true;
            this.game.scene.add(book);
        }
    }

    createDesk(x, y, z) {
        // Desk top
        const deskTopGeometry = new THREE.BoxGeometry(2, 0.1, 1);
        const woodMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513,
            roughness: 0.8,
            metalness: 0.1
        });
        const deskTop = new THREE.Mesh(deskTopGeometry, woodMaterial);
        deskTop.position.set(x, y + 0.75, z);
        deskTop.castShadow = true;
        deskTop.receiveShadow = true;
        this.game.scene.add(deskTop);
        this.game.colliders.push(deskTop);
        
        // Desk legs
        const legGeometry = new THREE.BoxGeometry(0.1, 0.75, 0.1);
        for (let i = 0; i < 4; i++) {
            const leg = new THREE.Mesh(legGeometry, woodMaterial);
            const xPos = x - 0.9 + (i % 2) * 1.8;
            const zPos = z - 0.45 + Math.floor(i / 2) * 0.9;
            leg.position.set(xPos, y + 0.375, zPos);
            leg.castShadow = true;
            leg.receiveShadow = true;
            this.game.scene.add(leg);
            this.game.colliders.push(leg); 
        }
        
        // Add a quill and inkpot
        this.createQuill(x + 0.5, y + 0.8, z - 0.2);
        // Add a chair
        this.createChair(x, y, z + 0.6);
    }

    createQuill(x, y, z) {
        // Inkpot
        const potGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 12);
        const potMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x191919,
            roughness: 0.5,
            metalness: 0.8
        });
        
        const inkpot = new THREE.Mesh(potGeometry, potMaterial);
        inkpot.position.set(x, y, z);
        inkpot.castShadow = true;
        inkpot.receiveShadow = true;
        this.game.scene.add(inkpot);
        
        // Quill
        const quillGeometry = new THREE.ConeGeometry(0.01, 0.2, 8);
        const quillMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xEEEEEE,
            roughness: 0.9,
            metalness: 0.1
        });
        
        this.quill = new THREE.Mesh(quillGeometry, quillMaterial);
        this.quill.position.set(x + 0.1, y + 0.08, z);
        this.quill.rotation.set(Math.PI/6, 0, Math.PI/6);
        this.quill.castShadow = true;
        this.game.scene.add(this.quill);
        
        // Make quill interactable
        this.quill.userData = {
            interactable: true,
            type: 'quill',
            interaction: () => {
                this.game.showSarcasmMessage('Yes, take my quill. I\'m sure YOUR words will be MUCH more profound than mine.');
                if (this.game.sounds.quillSound) {
                    this.game.sounds.quillSound.play();
                }
            }
        };
        this.game.interactableObjects.push(this.quill);
    }

    createChair(x, y, z) {
        // Chair seat
        const seatGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.6);
        const woodMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const seat = new THREE.Mesh(seatGeometry, woodMaterial);
        seat.position.set(x, y + 0.5, z);
        seat.castShadow = true;
        seat.receiveShadow = true;
        this.game.scene.add(seat);
        this.game.colliders.push(seat);
        
        // Chair back
        const backGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.1);
        const back = new THREE.Mesh(backGeometry, woodMaterial);
        back.position.set(x, y + 0.8, z + 0.25);
        back.castShadow = true;
        back.receiveShadow = true;
        this.game.scene.add(back);
        this.game.colliders.push(back);
        
        // Chair legs
        const legGeometry = new THREE.BoxGeometry(0.05, 0.5, 0.05);
        
        for (let i = 0; i < 4; i++) {
            const leg = new THREE.Mesh(legGeometry, woodMaterial);
            const xPos = x - 0.25 + (i % 2) * 0.5;
            const zPos = z - 0.25 + Math.floor(i / 2) * 0.5;
            leg.position.set(xPos, y + 0.25, zPos);
            leg.castShadow = true;
            leg.receiveShadow = true;
            this.game.scene.add(leg);
            this.game.colliders.push(leg); 
        }
    }

    createArmchair(x, y, z) {
        const fabricMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x964B00,
            roughness: 0.8,
            metalness: 0.1
        });
        
        // Create a group for all armchair components
        const armchairGroup = new THREE.Group();
        
        // Armchair base
        const baseGeometry = new THREE.BoxGeometry(1.2, 0.5, 1);
        const base = new THREE.Mesh(baseGeometry, fabricMaterial);
        base.position.set(x, y + 0.25, z);
        base.castShadow = true;
        base.receiveShadow = true;
        armchairGroup.add(base);
        
        // Armchair back
        const backGeometry = new THREE.BoxGeometry(1.2, 1, 0.2);
        const back = new THREE.Mesh(backGeometry, fabricMaterial);
        back.position.set(x, y + 0.75, z + 0.4);
        back.castShadow = true;
        back.receiveShadow = true;
        armchairGroup.add(back);
        
        // Armchair arms
        for (let i = 0; i < 2; i++) {
            const armGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.8);
            const arm = new THREE.Mesh(armGeometry, fabricMaterial);
            const xPos = x - 0.5 + i * 1;
            arm.position.set(xPos, y + 0.55, z);
            arm.castShadow = true;
            arm.receiveShadow = true;
            armchairGroup.add(arm);
        }
        
        // Add the entire armchair group to the scene
        this.game.scene.add(armchairGroup);
        
        // Compute a bounding box that encompasses the whole armchair group
        const boundingBox = new THREE.Box3().setFromObject(armchairGroup);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        
        // Create an invisible collider representing the composite collision area for the armchair
        const colliderGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        const colliderMaterial = new THREE.MeshBasicMaterial({ visible: false });
        const collider = new THREE.Mesh(colliderGeometry, colliderMaterial);
        collider.position.copy(center);
        this.game.scene.add(collider);
        this.game.colliders.push(collider);
        
        // Set up interaction on the visible part of the armchair (using the base)
        base.userData = {
            interactable: true,
            type: 'armchair',
            interaction: () => {
                this.game.showSarcasmMessage('Ah, an armchair. Where I ponder the depths of human folly. And occasionally nap.');
            }
        };
        this.game.interactableObjects.push(base);
    }

    createPictureFrame(x, y, z) {
        // Frame
        const frameGeometry = new THREE.BoxGeometry(1.2, 1.5, 0.05);
        // Replace remote texture with solid color
        const frameMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4a3f35,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(x, y, z);
        frame.castShadow = true;
        this.game.scene.add(frame);
        
        // Generate a post-apocalyptic ranger image
        this.createRangerPortrait(x, y, z + 0.03);
        
        // Make frame interactable
        frame.userData = {
            interactable: true,
            type: 'picture',
            interaction: () => {
                this.game.showSarcasmMessage('Ah, the mysterious ranger. Probably the only one who could tolerate my wit in the wasteland.');
            }
        };
        this.game.interactableObjects.push(frame);
    }

    createRangerPortrait(x, y, z) {
        // Create canvas for the portrait
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 320;
        const ctx = canvas.getContext('2d');
        
        // Draw a post-apocalyptic ranger with hood
        // Background
        ctx.fillStyle = '#2c2c2d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Hood and silhouette
        ctx.fillStyle = '#0f0f0f';
        ctx.beginPath();
        ctx.ellipse(128, 120, 70, 85, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Hood opening
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.ellipse(128, 130, 40, 50, 0, 0, Math.PI);
        ctx.fill();
        
        // Faint facial features
        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.ellipse(128, 125, 20, 25, 0, 0, Math.PI);
        ctx.fill();
        
        // Eyes glint
        ctx.fillStyle = '#939393';
        ctx.beginPath();
        ctx.ellipse(115, 120, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(141, 120, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Body/cloak
        ctx.fillStyle = '#0f0f0f';
        ctx.beginPath();
        ctx.moveTo(80, 170);
        ctx.lineTo(176, 170);
        ctx.lineTo(190, 320);
        ctx.lineTo(66, 320);
        ctx.closePath();
        ctx.fill();
        
        // Wasteland background
        ctx.fillStyle = '#5c4033';
        ctx.fillRect(0, 230, canvas.width, 90);
        
        // Dead trees
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(50, 280);
        ctx.lineTo(50, 230);
        ctx.lineTo(30, 210);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(50, 230);
        ctx.lineTo(70, 215);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(200, 270);
        ctx.lineTo(200, 220);
        ctx.lineTo(180, 200);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(200, 220);
        ctx.lineTo(220, 205);
        ctx.stroke();
        
        // Convert to texture
        const texture = new THREE.CanvasTexture(canvas);
        const pictureMaterial = new THREE.MeshBasicMaterial({ map: texture });
        const pictureGeometry = new THREE.PlaneGeometry(1, 1.3);
        const picture = new THREE.Mesh(pictureGeometry, pictureMaterial);
        picture.position.set(x, y, z);
        this.game.scene.add(picture);
    }

    createBed(x, y, z) {
        // Bed base
        const baseGeometry = new THREE.BoxGeometry(2, 0.4, 3);
        // Replace remote texture with solid color
        const woodMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const base = new THREE.Mesh(baseGeometry, woodMaterial);
        base.position.set(x, y + 0.2, z);
        base.castShadow = true;
        base.receiveShadow = true;
        this.game.scene.add(base);
        this.game.colliders.push(base);
        
        // Mattress
        const mattressGeometry = new THREE.BoxGeometry(1.8, 0.2, 2.8);
        // Replace remote texture with solid color
        const mattressMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xCCCCCC,
            roughness: 0.7,
            metalness: 0.1
        });
        
        const mattress = new THREE.Mesh(mattressGeometry, mattressMaterial);
        mattress.position.set(x, y + 0.5, z);
        mattress.castShadow = true;
        mattress.receiveShadow = true;
        this.game.scene.add(mattress);
        
        // Pillow
        const pillowGeometry = new THREE.BoxGeometry(1.4, 0.15, 0.6);
        const pillowMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xEEEEEE,
            roughness: 0.7,
            metalness: 0.1
        });
        
        const pillow = new THREE.Mesh(pillowGeometry, pillowMaterial);
        pillow.position.set(x, y + 0.675, z + 1); 
        pillow.castShadow = true;
        pillow.receiveShadow = true;
        this.game.scene.add(pillow);
        
        // Headboard
        const headboardGeometry = new THREE.BoxGeometry(2, 1, 0.1);
        const headboard = new THREE.Mesh(headboardGeometry, woodMaterial);
        headboard.position.set(x, y + 0.9, z + 1.5); 
        headboard.castShadow = true;
        headboard.receiveShadow = true;
        this.game.scene.add(headboard);
        this.game.colliders.push(headboard);
        
        // Make bed interactable
        mattress.userData = {
            interactable: true,
            type: 'bed',
            interaction: () => {
                this.game.showSarcasmMessage('Sleep? Only for the weak! I haven\'t slept in three days, and my sarcasm has never been sharper.');
                if (this.game.sounds.armchairSound) {
                    this.game.sounds.armchairSound.play();
                }
            }
        };
        this.game.interactableObjects.push(mattress);
    }

    createCabinet(x, y, z) {
        const cabinetGroup = new THREE.Group();
        // Cabinet base
        const baseGeometry = new THREE.BoxGeometry(1, 2.5, 0.4);
        const baseMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x5C4033,
            roughness: 0.8,
            metalness: 0.1
        });
        const cabinetBase = new THREE.Mesh(baseGeometry, baseMaterial);
        cabinetBase.castShadow = true;
        cabinetBase.receiveShadow = true;
        cabinetGroup.add(cabinetBase);
        // Cabinet doors
        const doorGeometry = new THREE.BoxGeometry(0.48, 2.3, 0.05);
        const doorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x7B5E57,
            roughness: 0.9,
            metalness: 0.2
        });
        const leftDoor = new THREE.Mesh(doorGeometry, doorMaterial);
        const rightDoor = new THREE.Mesh(doorGeometry, doorMaterial);
        leftDoor.position.set(-0.26, 0, 0.225);
        rightDoor.position.set(0.26, 0, 0.225);
        cabinetGroup.add(leftDoor);
        cabinetGroup.add(rightDoor);
        // Cabinet handles
        const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 12);
        const handleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xCCCCCC,
            roughness: 0.5,
            metalness: 0.8 
        });
        const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        leftHandle.rotation.z = Math.PI / 2;
        rightHandle.rotation.z = Math.PI / 2;
        leftHandle.position.set(-0.5, 0, 0.225);
        rightHandle.position.set(0.5, 0, 0.225);
        cabinetGroup.add(leftHandle);
        cabinetGroup.add(rightHandle);
        cabinetGroup.position.set(x, y + 1.25, z);
        this.game.scene.add(cabinetGroup);
        this.game.colliders.push(cabinetGroup);
        cabinetGroup.userData = {
            interactable: true,
            type: 'cabinet',
            interaction: () => {
                this.game.showSarcasmMessage('A cabinet to hide your secrets, or to hoard more useless trinkets? Your choice.');
            }
        };
        this.game.interactableObjects.push(cabinetGroup);
    }

    createTableLamp(x, y, z) {
        const lampGroup = new THREE.Group();
        // Lamp base
        const baseGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
        const baseMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x222222,
            roughness: 0.7,
            metalness: 0.8 
        });
        const lampBase = new THREE.Mesh(baseGeometry, baseMaterial);
        lampBase.castShadow = true;
        lampBase.receiveShadow = true;
        lampGroup.add(lampBase);
        // Lamp stem
        const stemGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 12);
        const stemMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            roughness: 0.8,
            metalness: 0.5 
        });
        const lampStem = new THREE.Mesh(stemGeometry, stemMaterial);
        lampStem.position.y = 0.4;
        lampStem.castShadow = true;
        lampStem.receiveShadow = true;
        lampGroup.add(lampStem);
        // Lamp shade
        const shadeGeometry = new THREE.ConeGeometry(0.25, 0.4, 16);
        const shadeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFD700,
            roughness: 0.5,
            metalness: 0.3,
            emissive: 0xAAAA00,
            emissiveIntensity: 0.5 
        });
        const lampShade = new THREE.Mesh(shadeGeometry, shadeMaterial);
        lampShade.position.y = 0.9;
        lampShade.castShadow = true;
        lampShade.receiveShadow = true;
        lampGroup.add(lampShade);
        lampGroup.position.set(x, y, z);
        this.game.scene.add(lampGroup);
        this.game.colliders.push(lampGroup);
        lampGroup.userData = {
            interactable: true,
            type: 'tableLamp',
            interaction: () => {
                this.game.showSarcasmMessage('A table lamp: because every room needs a touch of artificial glow to hide its darkness.');
            }
        };
        this.game.interactableObjects.push(lampGroup);
    }
}

export { Furniture };