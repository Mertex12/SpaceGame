// Texture helpers: drawShipShape() and generateTextureFromDef()
function drawShipShape(graphics, shapeIndex, shipColor, engineColor, options = {}) {
    const { lineWidth = 3, cockpitColor = 0x88ccff, engineY = 27 } = options;

    graphics.lineStyle(lineWidth, 0xffffff, 1);
    graphics.fillStyle(shipColor, 1);

    switch (shapeIndex) {
        case 0: // Triangle
            graphics.beginPath();
            graphics.moveTo(16, 0);
            graphics.lineTo(32, 32);
            graphics.lineTo(16, 26);
            graphics.lineTo(0, 32);
            graphics.closePath();
            graphics.fillPath();
            graphics.strokePath();
            break;
        case 1: // Wide fighter jet
            graphics.beginPath();
            graphics.moveTo(16, 0);
            graphics.lineTo(30, 26);
            graphics.lineTo(28, 32);
            graphics.lineTo(4, 32);
            graphics.lineTo(2, 26);
            graphics.closePath();
            graphics.fillPath();
            graphics.strokePath();
            break;
        case 2: // Cross fighter
            graphics.beginPath();
            graphics.moveTo(16, 0);
            graphics.lineTo(24, 12);
            graphics.lineTo(32, 16);
            graphics.lineTo(24, 20);
            graphics.lineTo(16, 32);
            graphics.lineTo(8, 20);
            graphics.lineTo(0, 16);
            graphics.lineTo(8, 12);
            graphics.closePath();
            graphics.fillPath();
            graphics.strokePath();
            break;
        case 3: // Rounded sci-fi
            graphics.fillCircle(16, 16, 14);
            graphics.lineStyle(lineWidth, 0xffffff, 1);
            graphics.strokeCircle(16, 16, 14);
            break;
        case 4: // Diamond ship
            graphics.beginPath();
            graphics.moveTo(16, 0);
            graphics.lineTo(26, 16);
            graphics.lineTo(16, 32);
            graphics.lineTo(6, 16);
            graphics.closePath();
            graphics.fillPath();
            graphics.strokePath();
            break;
    }

    graphics.fillStyle(cockpitColor, 1);
    graphics.fillCircle(16, 14, 5);

    graphics.fillStyle(engineColor, 1);
    graphics.fillCircle(11, engineY, 3);
    graphics.fillCircle(21, engineY, 3);
}

function generateTextureFromDef(scene, key, def) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    for (const step of def.steps) {
        const [cmd, ...a] = step;
        switch (cmd) {
            case 'fill': g.fillStyle(a[0], a[1] ?? 1); break;
            case 'stroke': g.lineStyle(a[0], a[1], a[2] ?? 1); break;
            case 'fillPoly': {
                g.beginPath(); g.moveTo(a[0][0], a[0][1]);
                for (let i = 2; i < a[0].length; i += 2) g.lineTo(a[0][i], a[0][i+1]);
                g.closePath(); g.fillPath(); break;
            }
            case 'strokePoly': {
                g.beginPath(); g.moveTo(a[0][0], a[0][1]);
                for (let i = 2; i < a[0].length; i += 2) g.lineTo(a[0][i], a[0][i+1]);
                g.closePath(); g.strokePath(); break;
            }
            case 'fillPrev': g.fillPath(); break;
            case 'circle': g.fillCircle(a[0], a[1], a[2]); break;
            case 'strokeCircle': g.strokeCircle(a[0], a[1], a[2]); break;
            case 'rect': g.fillRect(a[0], a[1], a[2], a[3]); break;
            case 'tri': g.fillTriangle(a[0], a[1], a[2], a[3], a[4], a[5]); break;
            case 'line': g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(a[2], a[3]); g.strokePath(); break;
            case 'openStroke': {
                g.beginPath(); g.moveTo(a[0][0], a[0][1]);
                for (let i = 2; i < a[0].length; i += 2) g.lineTo(a[0][i], a[0][i+1]);
                g.strokePath(); break;
            }
        }
    }
    g.generateTexture(key, def.w, def.h);
}
