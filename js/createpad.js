document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("blueprintCanvas");
  const ctx = canvas.getContext("2d");
  let offsetX = 0,
   offsetY = 0;
  let scale = 1;
  let isDragging = false;
  let startX, startY;
  let currentTool = null;
  let drawing = false;
  let shapes = [];
  let previewShape = null;
  let lastTouchDistance = null;
  let isBoxDragging = false;
  let selectedShape = null;
  let boxStartX, boxStartY;
  let movingShape = null;
  let stretchingShape = null;
  let stretchAnchor = null;
  
  const dimensionInput = document.getElementById("dimensionInput");
  const angleInput = document.getElementById("angleInput");
  const exportOptions = document.getElementById("exportOptions");
  const downloadBtn = document.getElementById("downloadBtn");
  const copyBtn = document.getElementById("copyBtn");
  /*function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 70; // leave space for toolbar
  redrawShapes();
}*/
function resizeCanvas() {
  const toolbarHeight = document.getElementById("toolbar").offsetHeight;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = (window.innerHeight - toolbarHeight) + "px";

  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width;
  canvas.height = rect.height;

  redrawShapes();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // initial call

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  ctx.strokeStyle = "#ddd";

  // Calculate visible bounds in world coordinates
  const left = -offsetX / scale;
  const top = -offsetY / scale;
  const right = left + canvas.width / scale;
  const bottom = top + canvas.height / scale;

  // Round to nearest grid step
  const step = 50;
  const startX = Math.floor(left / step) * step;
  const endX = Math.ceil(right / step) * step;
  const startY = Math.floor(top / step) * step;
  const endY = Math.ceil(bottom / step) * step;

  // Vertical lines
  for (let x = startX; x <= endX; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, startY);
    ctx.lineTo(x, endY);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = startY; y <= endY; y += step) {
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(endX, y);
    ctx.stroke();
  }

  ctx.restore();
}
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "a") {
      e.preventDefault();
      shapes.forEach((shape) => (shape.selected = true));
      exportOptions.style.display = "block"; // show buttons
      redrawShapes();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "d") {
      e.preventDefault();
      shapes.forEach((shape) => (shape.selected = false));
      //exportOptions.style.display = "none"; // hide buttons
      redrawShapes();
    }
  });
  // Download button
  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "blueprint.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  // Copy button
  copyBtn.addEventListener("click", () => {
    canvas.toBlob((blob) => {
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]).then(() => {
        alert("Canvas copied to clipboard!");
      });
    });
  });
  // Helper: always use same coordinate system
function getCanvasCoords(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left - offsetX) / scale,
    y: (e.clientY - rect.top - offsetY) / scale
  };
}

  document.getElementById("eraseBtn").addEventListener("click", () => {
    currentTool = "erase";
  });
  function hitTest(shape, x, y) {
    if (shape.type === "wall") {
      // distance from point to line segment
      const dx = shape.x2 - shape.x1;
      const dy = shape.y2 - shape.y1;
      const lengthSq = dx * dx + dy * dy;
      let t = ((x - shape.x1) * dx + (y - shape.y1) * dy) / lengthSq;
      t = Math.max(0, Math.min(1, t));
      const projX = shape.x1 + t * dx;
      const projY = shape.y1 + t * dy;
      const dist = Math.hypot(x - projX, y - projY);
      return dist < 5; // tolerance
    } else if (shape.type === "room") {
      return (
        x >= shape.x &&
        x <= shape.x + shape.w &&
        y >= shape.y &&
        y <= shape.y + shape.h
      );
    } else if (shape.type === "circle") {
      const dist = Math.hypot(x - shape.x, y - shape.y);
      return dist <= shape.r;
    } else if (shape.type === "arc") {
      const dist = Math.hypot(x - shape.x, y - shape.y);
      return dist <= shape.r + 5 && dist >= shape.r - 5;
    } else if (shape.type === "pillar") {
      const dist = Math.hypot(x - shape.x, y - shape.y);
      return dist <= (shape.r || 10);
    } else if (shape.type === "pillarSquare") {
      const size = shape.size || 20;
      return (
        x >= shape.x - size / 2 &&
        x <= shape.x + size / 2 &&
        y >= shape.y - size / 2 &&
        y <= shape.y + size / 2
      );
    } else if (shape.type === "polygon") {
      // point-in-polygon test
      let inside = false;
      for (let i = 0, j = shape.sides - 1; i < shape.sides; j = i++) {
        const angleI = (i * 2 * Math.PI) / shape.sides - Math.PI / 2;
        const angleJ = (j * 2 * Math.PI) / shape.sides - Math.PI / 2;
        const xi = shape.x + shape.r * Math.cos(angleI);
        const yi = shape.y + shape.r * Math.sin(angleI);
        const xj = shape.x + shape.r * Math.cos(angleJ);
        const yj = shape.y + shape.r * Math.sin(angleJ);

        const intersect =
          yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    } else if (shape.type === "bed") {
      return (
        x >= shape.x &&
        x <= shape.x + shape.w &&
        y >= shape.y &&
        y <= shape.y + shape.h
      );
    } else if (shape.type === "fridge") {
  return (
    x >= shape.x &&
    x <= shape.x + shape.w &&
    y >= shape.y &&
    y <= shape.y + shape.h
  );
} else if (shape.type === "almira") {
      return (
        x >= shape.x &&
        x <= shape.x + shape.w &&
        y >= shape.y &&
        y <= shape.y + shape.h
      );
    }

    return false;
  }
  function redrawShapes() {
    drawGrid();
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    ctx.strokeStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillStyle = "red";
    shapes.forEach((shape) => {
      if (shape.selected) {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
      }

      if (shape.type === "wall") {
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.stroke();
        if (shape.dimension) {
          const midX = (shape.x1 + shape.x2) / 2;
          const midY = (shape.y1 + shape.y2) / 2;
          ctx.fillText(shape.dimension, midX + 5, midY - 5);
        }
      } else if (shape.type === "room") {
        ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
      } else if (shape.type === "circle") {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
        ctx.stroke();
      } else if (shape.type === "arc") {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.r, shape.startAngle, shape.endAngle);
        ctx.stroke();
        if (shape.angle) {
          ctx.fillText(shape.angle + "°", shape.x + shape.r + 10, shape.y);
        }
      } else if (shape.type === "pillar") {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, 10, 0, Math.PI * 2); // circle pillar
        ctx.fillStyle = "brown"; // pillar fill color
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
      } else if (shape.type === "pillarSquare") {
        ctx.fillStyle = "gray";
        ctx.fillRect(shape.x - 10, shape.y - 10, 20, 20); // 20x20 square pillar
        ctx.strokeRect(shape.x - 10, shape.y - 10, 20, 20);
        ctx.font = "bold 10px Arial";
       ctx.fillStyle = "#000000"; // black text
       ctx.fillText("column", shape.x + 5, shape.y + 5);
      }  else if (shape.type === "bed") {
  ctx.fillStyle = "#cfcfcf";
  ctx.fillRect(shape.x, shape.y, shape.w, shape.h);
  ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
   ctx.font = "bold 14px Arial";
  ctx.fillStyle = "#000000"; // black text
  ctx.fillText("Bed", shape.x + 5, shape.y + 5);

} else if (shape.type === "fridge") {
  ctx.fillStyle = "#a0d8ef";
  ctx.fillRect(shape.x, shape.y, shape.w, shape.h);
  ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
 ctx.font = "bold 14px Arial";
  ctx.fillStyle = "#ff0000"; // red text
  ctx.fillText("Fridge", shape.x + 5, shape.y + 5);

} else if (shape.type === "almira") {
  ctx.fillStyle = "#deb887";
  ctx.fillRect(shape.x, shape.y, shape.w, shape.h);
  ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
  ctx.font = "bold 14px Arial";
  ctx.fillStyle = "#003366"; // dark blue text
  ctx.fillText("Almira", shape.x + 5, shape.y + 5);
} else if (shape.type === "polygon") {
        ctx.beginPath();
        for (let i = 0; i < shape.sides; i++) {
          const angle = (i * 2 * Math.PI) / shape.sides - Math.PI / 2; // start from top
          const px = shape.x + shape.r * Math.cos(angle);
          const py = shape.y + shape.r * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    });
    // Draw bounding box if any shapes are selected
    const selectedShapes = shapes.filter((s) => s.selected);
    if (selectedShapes.length > 0) {
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

      selectedShapes.forEach((s) => {
        if (s.type === "wall") {
          minX = Math.min(minX, s.x1, s.x2);
          minY = Math.min(minY, s.y1, s.y2);
          maxX = Math.max(maxX, s.x1, s.x2);
          maxY = Math.max(maxY, s.y1, s.y2);
        } else if (s.type === "room") {
          minX = Math.min(minX, s.x);
          minY = Math.min(minY, s.y);
          maxX = Math.max(maxX, s.x + s.w);
          maxY = Math.max(maxY, s.y + s.h);
        } else if (s.type === "circle" || s.type === "arc") {
          minX = Math.min(minX, s.x - s.r);
          minY = Math.min(minY, s.y - s.r);
          maxX = Math.max(maxX, s.x + s.r);
          maxY = Math.max(maxY, s.y + s.r);
        } else if (s.type === "pillar") {
          minX = Math.min(minX, s.x - 10);
          minY = Math.min(minY, s.y - 10);
          maxX = Math.max(maxX, s.x + 10);
          maxY = Math.max(maxY, s.y + 10);
        } else if (s.type === "pillarSquare") {
          minX = Math.min(minX, s.x - 10);
          minY = Math.min(minY, s.y - 10);
          maxX = Math.max(maxX, s.x + 10);
          maxY = Math.max(maxY, s.y + 10);
        } else if (s.type === "polygon"){
          minX = Math.min(minX, s.x - s,r);
          minY = Math.min(minY, s.y - s.r);
          maxX = Math.max(maxX, s.x + s.r);
          maxY = Math.max(maxY, s.y + s.r);
        } else if (s.type === "bed" || s.type === "fridge" || s.type === "almira") {
          minX = Math.min(minX, s.x);
          minY = Math.min(minY, s.y);
          maxX = Math.max(maxX, s.x + s.w);
          maxY = Math.max(maxY, s.y + s.h);
        }
      });

      ctx.strokeStyle = "blue";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]); // dashed outline
      ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
      ctx.setLineDash([]); // reset
    }

    // Draw preview shape if exists
    if (previewShape) {
      ctx.strokeStyle = "blue";
      if (previewShape.type === "wall") {
        ctx.beginPath();
        ctx.moveTo(previewShape.x1, previewShape.y1);
        ctx.lineTo(previewShape.x2, previewShape.y2);
        ctx.stroke();
      } else if (previewShape.type === "room") {
        ctx.strokeRect(
          previewShape.x,
          previewShape.y,
          previewShape.w,
          previewShape.h,
        );
      } else if (previewShape.type === "circle") {
        ctx.beginPath();
        ctx.arc(previewShape.x, previewShape.y, previewShape.r, 0, Math.PI * 2);
        ctx.stroke();
      } else if (previewShape.type === "arc") {
        ctx.beginPath();
        ctx.arc(
          previewShape.x,
          previewShape.y,
          previewShape.r,
          previewShape.startAngle,
          previewShape.endAngle,
        );
        ctx.stroke();
      } else if (previewShape.type === "pillar") {
        ctx.beginPath();
        ctx.arc(previewShape.x, previewShape.y, 10, 0, Math.PI * 2); // circle pillar
        ctx.fillStyle = "brown";
        ctx.fill();
        ctx.stroke();
      } else if (previewShape.type === "pillarSquare") {
        ctx.fillStyle = "gray";
        ctx.fillRect(previewShape.x - 10, previewShape.y - 10, 20, 20);
        ctx.strokeRect(previewShape.x - 10, previewShape.y - 10, 20, 20);
      } else if (previewShape.type === "polygon") {
        ctx.beginPath();
        for (let i = 0; i < previewShape.sides; i++) {
          const angle = (i * 2 * Math.PI) / previewShape.sides - Math.PI / 2;
          const px = previewShape.x + previewShape.r * Math.cos(angle);
          const py = previewShape.y + previewShape.r * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      } else if (previewShape.type === "bed" || previewShape.type === "fridge" || previewShape.type === "almira") {
        ctx.fillStyle = previewShape.type === "bed" ? "lightblue" : previewShape.type === "fridge" ? "lightgray" : previewShape.type === "almira" ? "tan" : "white";
        ctx.fillRect(previewShape.x, previewShape.y, previewShape.w, previewShape.h);
        ctx.strokeRect(previewShape.x, previewShape.y, previewShape.w, previewShape.h);
      }
    }

    ctx.restore();
  }

  // Mouse events
canvas.addEventListener("mousedown", (e) => {
  const { x, y } = getCanvasCoords(e);
  startX = x;
  startY = y;
  drawing = true;

  const selectedShapes = shapes.filter((s) => s.selected);
  if (selectedShapes.length > 0) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    selectedShapes.forEach((s) => {
      if (s.type === "wall") {
        minX = Math.min(minX, s.x1, s.x2);
        minY = Math.min(minY, s.y1, s.y2);
        maxX = Math.max(maxX, s.x1, s.x2);
        maxY = Math.max(maxY, s.y1, s.y2);
      } else if (s.type === "room") {
        minX = Math.min(minX, s.x);
        minY = Math.min(minY, s.y);
        maxX = Math.max(maxX, s.x + s.w);
        maxY = Math.max(maxY, s.y + s.h);
      } else if (s.type === "circle" || s.type === "arc") {
        minX = Math.min(minX, s.x - s.r);
        minY = Math.min(minY, s.y - s.r);
        maxX = Math.max(maxX, s.x + s.r);
        maxY = Math.max(maxY, s.y + s.r);
      } else if (s.type === "pillar" || s.type === "pillarSquare") {
        minX = Math.min(minX, s.x - 10);
        minY = Math.min(minY, s.y - 10);
        maxX = Math.max(maxX, s.x + 10);
        maxY = Math.max(maxY, s.y + 10);
      } else if (s.type === "bed" || s.type === "fridge" || s.type === "almira") {
        minX = Math.min(minX, s.x);
        minY = Math.min(minY, s.y);
        maxX = Math.max(maxX, s.x + s.w);
        maxY = Math.max(maxY, s.y + s.h);
      } else if (s.type === "polygon") {minX = Math.min(minX, s.x - s.r);
        minY = Math.min(minY, s.y - s.r);
        maxX = Math.max(maxX, s.x + s.r);
        maxY = Math.max(maxY, s.y + s.r);
      }
    });

    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      isBoxDragging = true;
      boxStartX = x;
      boxStartY = y;
      return; // prevent starting a new drawing
    }
  }

  if (currentTool) {
    drawing = true;
    startX = x;
    startY = y;
  } else {
    isDragging = true;
    startX = x;
    startY = y;
  }

  if (currentTool === "stretch") {
    stretchingShape = shapes.find((s) => hitTest(s, x, y));
    if (stretchingShape) {
      stretchAnchor = { x, y };
    }
  }
  if (currentTool === "move") {
    movingShape = shapes.find((s) => hitTest(s, x, y));
  }

  if (currentTool === "erase") {
    for (let i = shapes.length - 1; i >= 0; i--) {
      if (hitTest(shapes[i], x, y)) {
        shapes.splice(i, 1);
        redrawShapes();
        break;
      }
    }
    return;
  }
});

canvas.addEventListener("mouseup", (e) => {
  isBoxDragging = false;
  const { x, y } = getCanvasCoords(e);

  // stop move/stretch
  if (currentTool === "move") {
    movingShape = null;
  }
  if (currentTool === "stretch") {
    stretchingShape = null;
    stretchAnchor = null;
  }

  // Wall
  if (drawing && currentTool === "wall") {
    const newWall = { type: "wall", x1: startX, y1: startY, x2: x, y2: y };
    shapes.push(newWall);

    // Dimension input at midpoint
    const midX = (newWall.x1 + newWall.x2) / 2;
    const midY = (newWall.y1 + newWall.y2) / 2;
    dimensionInput.style.left = midX + canvas.offsetLeft + "px";
    dimensionInput.style.top = midY + canvas.offsetTop + "px";
    dimensionInput.style.display = "block";
    dimensionInput.value = "";
    dimensionInput.focus();
    dimensionInput.onkeydown = (ev) => {
      if (ev.key === "Enter") {
        newWall.dimension = dimensionInput.value;
        dimensionInput.style.display = "none";
        redrawShapes();
      }
    };
  }

  // Room
  if (drawing && currentTool === "room") {
    shapes.push({
      type: "room",
      x: Math.min(startX, x),
      y: Math.min(startY, y),
      w: Math.abs(x - startX),
      h: Math.abs(y - startY),
    });
  }

  // Circle
  if (drawing && currentTool === "circle") {
    const dx = x - startX;
    const dy = y - startY;
    const r = Math.sqrt(dx * dx + dy * dy);
    shapes.push({ type: "circle", x: startX, y: startY, r });
  }

  // Arc
  if (drawing && currentTool === "arc") {
    const dx = x - startX;
    const dy = y - startY;
    const r = Math.sqrt(dx * dx + dy * dy);
    const newArc = {
      type: "arc",
      x: startX,
      y: startY,
      r,
      startAngle: 0,
      endAngle: Math.atan2(dy, dx),
    };
    shapes.push(newArc);

    // Floating angle input
    angleInput.style.left = newArc.x + canvas.offsetLeft + newArc.r + 10 + "px";
    angleInput.style.top = newArc.y + canvas.offsetTop + "px";
    angleInput.style.display = "block";
    angleInput.value = "";
    angleInput.focus();
    angleInput.onkeydown = (ev) => {
      if (ev.key === "Enter") {
        newArc.angle = parseFloat(angleInput.value);
        angleInput.style.display = "none";
        redrawShapes();
      }
    };
  }

  // Polygon
  if (drawing && currentTool === "polygon") {
    const dx = x - startX;
    const dy = y - startY;
    const r = Math.sqrt(dx * dx + dy * dy);
    const sides = parseInt(document.getElementById("polygonSides").value, 10);
    shapes.push({ type: "polygon", x: startX, y: startY, r, sides });
  }

  // Pillar / PillarSquare
  if (drawing && currentTool === "pillar") {
    const dx = x - startX;
    const dy = y - startY;
    const r = Math.sqrt(dx * dx + dy * dy);
    shapes.push({ type: "pillar", x: startX, y: startY, r: r || 10 });
  } else if (drawing && currentTool === "pillarSquare") {
    shapes.push({ type: "pillarSquare", x: startX, y: startY, size: 20 });
  }

  // Furniture (Bed, Fridge, Almira)
  else if (drawing && (currentTool === "bed" || currentTool === "fridge" || currentTool === "almira")) {
    const dx = x - startX;
    const dy = y - startY;
    const w = Math.abs(dx);
    const h = Math.abs(dy);

    // adjust x,y so rectangle starts at correct corner
    const rectX = dx < 0 ? x : startX;
    const rectY = dy < 0 ? y : startY;

    shapes.push({
      type: currentTool,
      x: rectX,
      y: rectY,
      w,
      h
    });
  }

  // reset flags
  drawing = false;
  previewShape = null;
  isDragging = false;
  redrawShapes();
});
canvas.addEventListener("mousemove", (e) => {
  const { x, y } = getCanvasCoords(e);

  // Box dragging (move selected shapes together)
  if (isBoxDragging) {
    const dx = x - boxStartX;
    const dy = y - boxStartY;

    shapes.forEach((s) => {
      if (s.selected) {
        if (s.type === "wall") {
          s.x1 += dx; s.y1 += dy;
          s.x2 += dx; s.y2 += dy;
        } else {
          s.x += dx;
          s.y += dy;
        }
      }
    });

    boxStartX = x;
    boxStartY = y;
    redrawShapes();
    return;
  }

  // Drawing preview
  if (drawing) {
    if (currentTool === "wall") {
      previewShape = { type: "wall", x1: startX, y1: startY, x2: x, y2: y };
    } else if (currentTool === "room") {
      previewShape = {
        type: "room",
        x: Math.min(startX, x),
        y: Math.min(startY, y),
        w: Math.abs(x - startX),
        h: Math.abs(y - startY),
      };
    } else if (currentTool === "circle") {
      const dx = x - startX, dy = y - startY;
      const r = Math.sqrt(dx * dx + dy * dy);
      previewShape = { type: "circle", x: startX, y: startY, r };
    } else if (currentTool === "arc") {
      const dx = x - startX, dy = y - startY;
      const r = Math.sqrt(dx * dx + dy * dy);
      previewShape = {
        type: "arc",
        x: startX,
        y: startY,
        r,
        startAngle: 0,
        endAngle: Math.atan2(dy, dx),
      };
    } else if (currentTool === "pillar") {
      const dx = x - startX, dy = y - startY;
      const r = Math.sqrt(dx * dx + dy * dy);
      previewShape = { type: "pillar", x: startX, y: startY, r };
    } else if (currentTool === "pillarSquare") {
      previewShape = { type: "pillarSquare", x: startX, y: startY, size: 20 };
    } else if (currentTool === "polygon") {
      const dx = x - startX, dy = y - startY;
      const r = Math.sqrt(dx * dx + dy * dy);
      const sides = parseInt(document.getElementById("polygonSides").value, 10);
      previewShape = { type: "polygon", x: startX, y: startY, r, sides };
    } else if (currentTool === "bed" || currentTool === "fridge" || currentTool === "almira") {
      previewShape = {
        type: currentTool,
        x: Math.min(startX, x),
        y: Math.min(startY, y),
        w: Math.abs(x - startX),
        h: Math.abs(y - startY),
      };
    }
    redrawShapes();
  }

  // Canvas dragging (pan)
if (isDragging) {
   const dx = e.clientX - startX;
   const dy = e.clientY - startY;
  offsetX += dx;   // ❌ scale multiply hatao
  offsetY += dy;
   startX = e.clientX;
   startY = e.clientY;
  redrawShapes();
}


  // Stretching
  if (currentTool === "stretch" && stretchingShape && stretchAnchor) {
    if (stretchingShape.type === "wall") {
      stretchingShape.x2 = x;
      stretchingShape.y2 = y;
    } else if (stretchingShape.type === "room") {
      stretchingShape.w = x - stretchingShape.x;
      stretchingShape.h = y - stretchingShape.y;
    } else if (stretchingShape.type === "circle" || stretchingShape.type === "pillar") {
      const dx = x - stretchingShape.x, dy = y - stretchingShape.y;
      stretchingShape.r = Math.sqrt(dx * dx + dy * dy);
    } else if (stretchingShape.type === "arc") {
      const dx = x - stretchingShape.x, dy = y - stretchingShape.y;
      stretchingShape.r = Math.sqrt(dx * dx + dy * dy);
      stretchingShape.endAngle = Math.atan2(dy, dx);
    } else if (stretchingShape.type === "pillarSquare") {
      stretchingShape.size = Math.abs(x - stretchingShape.x) * 2;
    } else if (stretchingShape.type === "polygon") {
      const dx = x - stretchingShape.x, dy = y - stretchingShape.y;
      stretchingShape.r = Math.sqrt(dx * dx + dy * dy);
    } else if (stretchingShape.type === "bed" || stretchingShape.type === "fridge" || stretchingShape.type === "almira") {
      stretchingShape.w = Math.abs(x - stretchingShape.x);
      stretchingShape.h = Math.abs(y - stretchingShape.y);
    }
    redrawShapes();
  }

  // Moving
  if (currentTool === "move" && movingShape) {
    if (movingShape.type === "wall") {
      const dx = x - movingShape.x1;
      const dy = y - movingShape.y1;
      movingShape.x2 += dx;
      movingShape.y2 += dy;
      movingShape.x1 = x;
      movingShape.y1 = y;
    } else {
      movingShape.x = x;
      movingShape.y = y;
    }
    redrawShapes();
  }
});
  // Touch support
  canvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    if (currentTool) {
      drawing = true;
      startX = x;
      startY = y;
    } else {
      isDragging = true;
      startX = x - offsetX;
      startY = y - offsetY;
    }
  });
  canvas.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();

      // Get positions of both fingers
      const rect = canvas.getBoundingClientRect();
      const x1 = e.touches[0].clientX - rect.left;
      const y1 = e.touches[0].clientY - rect.top;
      const x2 = e.touches[1].clientX - rect.left;
      const y2 = e.touches[1].clientY - rect.top;

      // Midpoint between fingers
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      // Distance between fingers
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (lastTouchDistance) {
        const zoom = distance / lastTouchDistance; // ratio
        scale *= zoom;

        // Convert midpoint to world coords
        const worldX = (midX - offsetX) / lastTouchDistance;
        const worldY = (midY - offsetY) / lastTouchDistance;

        // Adjust offset so midpoint stays fixed
        offsetX = midX - worldX * scale;
        offsetY = midY - worldY * scale;

        redrawShapes();
      }

      lastTouchDistance = distance;
    }
  });

  canvas.addEventListener("touchend", (e) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.changedTouches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (drawing && currentTool === "wall") {
      shapes.push({ type: "wall", x1: startX, y1: startY, x2: x, y2: y });
    }
    if (drawing && currentTool === "room") {
      shapes.push({
        type: "room",
        x: startX,
        y: startY,
        w: x - startX,
        h: y - startY,
      });
    }
    if (drawing && currentTool === "circle") {
      const dx = x - startX;
      const dy = y - startY;
      const r = Math.sqrt(dx * dx + dy * dy);
      shapes.push({ type: "circle", x: startX, y: startY, r });
    }
    if (drawing && currentTool === "arc") {
      const dx = x - startX;
      const dy = y - startY;
      const r = Math.sqrt(dx * dx + dy * dy);
      shapes.push({
        type: "arc",
        x: startX,
        y: startY,
        r,
        startAngle: 0,
        endAngle: Math.atan2(dy, dx),
      });
    }
    if (drawing && currentTool === "pillar") {
      const dx = x - startX;
      const dy = y - startY;
      const r = Math.sqrt(dx * dx + dy * dy);
      shapes.push({ type: "pillar", x: startX, y: startY, r });
    }
    if (drawing && currentTool === "pillarSquare") {
      const dx = x - startX;
      const dy = y - startY;
      const r = Math.sqrt(dx * dx + dy * dy);
      shapes.push({ type: "pillarSquare", x: startX, y: startY, r });
    }

    drawing = false;
    isDragging = false;
    redrawShapes();
  });

  // Zoom logic
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();

    // Mouse position relative to canvas
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    // Convert to world coordinates
    const worldX = (mouseX - offsetX) / scale;
    const worldY = (mouseY - offsetY) / scale;

    // Zoom factor
    const zoom = e.deltaY < 0 ? 1.1 : 0.9;
    scale *= zoom;

    // Adjust offset so the world point stays under the cursor
    offsetX = mouseX - worldX * scale;
    offsetY = mouseY - worldY * scale;

    redrawShapes();
  });

  // Toolbar logic
  const startBtn = document.getElementById("startBtn");
  const buildingType = document.getElementById("buildingType");
  const landArea = document.getElementById("landArea");
  const toolbar = document.getElementById("toolbar");

  startBtn.addEventListener("click", () => {
    const type = buildingType.value;
    const area = landArea.value;

    toolbar.innerHTML = `
      <span>Blueprint: ${type.toUpperCase()} | Land Area: ${area} sq ft</span>
      <button id="addWallBtn">Add Wall</button>
      <button id="pillarBtn">Add Pillar</button>
      <button id="pillarSquareBtn">Sqpillar</button>
      <button id="addRoomBtn">Add Room</button>
      <button id="addCircleBtn">Add Circle</button>
      <button id="addArcBtn">Add Arc</button>
      <button id="stretchBtn">Stretch</button>
      <input id="polygonSides" type="number" min="3" max="12" value="5" style="display:none;"/>
      <button id="polygonBtn">Polygon</button>
      <button id="moveBtn">Move</button>
      <button id="undoBtn">Undo</button>
      <button id="redoBtn">Redo</button>
      <button id="addBedBtn">Bed</button>
     <button id="addFridgeBtn">Fridge</button>
     <button id="addAlmiraBtn">Almira</button>
    `;
    const polygonBtn = document.getElementById("polygonBtn");
    const polygonSides = document.getElementById("polygonSides");

    polygonBtn.addEventListener("click", () => {
      currentTool = "polygon";
      polygonSides.style.display = "inline";
      polygonSides.focus();
    });

    polygonSides.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        polygonSides.style.display = "none";
      }
    });

    document.getElementById("addWallBtn").addEventListener("click", () => {
      currentTool = "wall";
    });
    document.getElementById("pillarBtn").addEventListener("click", () => {
      currentTool = "pillar";
    });
    document.getElementById("pillarSquareBtn").addEventListener("click", () => {
      currentTool = "pillarSquare";
    });
    document.getElementById("addRoomBtn").addEventListener("click", () => {
      currentTool = "room";
    });
    document.getElementById("addCircleBtn").addEventListener("click", () => {
      currentTool = "circle";
    });
    document.getElementById("addArcBtn").addEventListener("click", () => {
      currentTool = "arc";
    });
    document.getElementById("stretchBtn").addEventListener("click", () => {
      currentTool = "stretch";
    });
    document.getElementById("polygonBtn").addEventListener("click", () => {
      currentTool = "polygon";
    });
    document.getElementById("addBedBtn").addEventListener("click", () => {
      currentTool = "bed";
    });
    document.getElementById("addFridgeBtn").addEventListener("click", () => {
      currentTool = "fridge";
    });
    document.getElementById("addAlmiraBtn").addEventListener("click", () => {
      currentTool = "almira";
    });

    document.getElementById("moveBtn").addEventListener("click", () => {
      currentTool = "move";
    });
    document.getElementById("undoBtn").addEventListener("click", () => {
      shapes.pop();
      redrawShapes();
    });

    document.getElementById("redoBtn").addEventListener("click", () => {
      // TODO: implement redo stack
      currentTool = null; //disable drawing when redo is clicked
    });
  });
});
