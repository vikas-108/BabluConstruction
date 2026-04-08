const socket = io("https://api.buildskil.com");
let userTables = []; // ✅ add this at top
const actionHistory = [];
let count = 0;
const max = 30;
function authHeaders(isFormData = false) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("cb_token")}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}
document.addEventListener("DOMContentLoaded", () => {
  const createBtn = document.getElementById("createBtn");
  createBtn.addEventListener("click", createTable);

  function createTable() {
    if (userTables.length >= 30) {
      showToast("You can create only 30 tables", "error");
      return;
    }
    if (count >= max) {
      createBtn.disabled = true;
      createBtn.innerText = "Limit Reached";
    } else {
      createBtn.disabled = false;
      createBtn.innerText = "Create Table";
    }
    const title = document.getElementById("tableTitle").value.trim();
    if (!title) {
      showToast("Please enter a title!", "error");
      return;
    }

    const wrapper = document.getElementById("tablesWrapper");

    const block = document.createElement("div");
    block.className = "table-block";

    const titleDiv = document.createElement("div");
    titleDiv.className = "table-title";

    const titleSpan = document.createElement("span");
    titleSpan.innerText = title;
    titleSpan.onclick = () => {
      contentDiv.style.display =
        contentDiv.style.display === "none" ? "block" : "none";
      //contentDiv.style.display = "none"; // collapsed by default
    };
    // Create horizontal button bar
    const buttonBar = document.createElement("div");
    buttonBar.className = "button-bar";
    // Phone input + Allow button
    const phoneInput = document.createElement("input");
    phoneInput.type = "tel";
    phoneInput.placeholder = "Enter phone number";
// ✅ Permission selector
const permissionSelect = document.createElement("select");

const optionEdit = document.createElement("option");
optionEdit.value = "edit";
optionEdit.innerText = "Can Edit";

const optionView = document.createElement("option");
optionView.value = "view";
optionView.innerText = "Can View";

permissionSelect.appendChild(optionEdit);
permissionSelect.appendChild(optionView);
    // Allow button with green check
    const saveBtn = document.createElement("button");
    saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk save-icon"></i>';
    //saveBtn.title = "Save";
    saveBtn.setAttribute("data-tooltip", "Save Table");
    saveBtn.onclick = async () => {
      const tableData = extractTableData(table);
      const phone = phoneInput.value.trim();
      const permission = permissionSelect.value;
      // ✅ Phone validation (optional but required for sharing)
      if (phone && !/^[0-9]{10}$/.test(phone)) {
        showToast("Please enter valid 10-digit phone number");
        return;
      }

      const payload = {
        title,
        data: tableData,
      };

      try {
        let tableId = block.dataset.id;

        // ================= SAVE TABLE =================
        if (tableId) {
          // UPDATE
          await fetch(`https://api.buildskil.com/api/tables/${tableId}`, {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify(payload),
          });
        } else {
          // CREATE
          const res = await fetch("https://api.buildskil.com/api/tables", {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(payload),
          });

          const result = await res.json();
          tableId = result._id;
          block.dataset.id = tableId;
        }
        // ================= SHARE TABLE =================
        if (phone) {
          const res = await fetch("https://api.buildskil.com/api/tables/share", {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({
              phone,
              tableId,
              permission // ✅ send this
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            showToast(data.message, "error"); // user not found / self share
          } else {
            showToast("Table saved & shared successfully");
            phoneInput.value = "";
          }
        } else {
          showToast("Table saved successfully");
        }

        // ================= LOCK TABLE =================
        lockTable(table, true);
      } catch (err) {
        console.error(err);
        showToast("Error saving table", "error");
      }
    };

    // Edit button with blue icon
    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fa-solid fa-pen edit-icon"></i>';
    //editBtn.title = "Edit";
    editBtn.setAttribute("data-tooltip", "Edit Table");
    editBtn.onclick = async () => {
      const data = extractTableData(table);

      const payload = {
        title,
        data,
        phone: phoneInput.value,
      };

      try {
        if (block.dataset.id) {
          // ✅ UPDATE
          await fetch(`https://api.buildskil.com/api/tables/${block.dataset.id}`, {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify(payload),
          });

          showToast("Updated!");
        } else {
          // ✅ CREATE
          const res = await fetch("https://api.buildskil.com/api/tables", {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(payload),
          });

          const result = await res.json();
          block.dataset.id = result._id;

          showToast("Created!");
        }

        lockTable(table, true);
      } catch (err) {
        console.error(err);
        showToast("Error saving table");
      }
    };
    // Delete button with red icon
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash delete-icon"></i>';
    //deleteBtn.title = "Delete";
    deleteBtn.setAttribute("data-tooltip", "Delete Table");
    deleteBtn.onclick = async () => {
      if (!block.dataset.id) {
        block.remove(); // not saved yet
        return;
      }

      await fetch(`https://api.buildskil.com/api/tables/${block.dataset.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      block.remove();
    };

    // Append all controls into horizontal bar
    buttonBar.appendChild(phoneInput);
    buttonBar.appendChild(permissionSelect); // ✅ new
    buttonBar.appendChild(saveBtn);
    buttonBar.appendChild(editBtn);
    buttonBar.appendChild(deleteBtn);

    titleDiv.appendChild(titleSpan);
    titleDiv.appendChild(buttonBar);

    const contentDiv = document.createElement("div");
    contentDiv.className = "table-content";

    const scrollDiv = document.createElement("div");
    scrollDiv.className = "table-scroll";

    const table = document.createElement("table");
    attachTableLogic(table);
    const headerRow = table.insertRow();
    const headerCell = document.createElement("th");
    headerCell.innerText = "Editable Cell";
    headerCell.contentEditable = "true"; // make header cell editable for user
    headerRow.appendChild(headerCell);

    const firstRow = table.insertRow();
    const firstCell = firstRow.insertCell();
    firstCell.contentEditable = "true";
    // Attach logic to every cell

    scrollDiv.appendChild(table);
    contentDiv.appendChild(scrollDiv);

    const controls = document.createElement("div");
    controls.className = "controls";

    const controlBar = document.createElement("div");
    controlBar.className = "button-bar";

    const addRowBtn = document.createElement("button");
    addRowBtn.innerHTML = '<i class="fa-solid fa-plus add-icon"></i> Row';
    addRowBtn.setAttribute("data-tooltip", "Add Row");
    addRowBtn.onclick = () => {
      /* if (phoneInput.style.display !== "none") {
        alert("Enter phone number and click Allow first!");
        return;
      }*/
      const row = table.insertRow();
      for (let i = 0; i < table.rows[0].cells.length; i++) {
        const cell = row.insertCell();
        cell.contentEditable = "true";
      }
    };

    const addColBtn = document.createElement("button");
    addColBtn.innerHTML = '<i class="fa-solid fa-plus add-icon"></i> Col';
    addColBtn.setAttribute("data-tooltip", "Add Column");
    addColBtn.onclick = () => {
      /* if (phoneInput.style.display !== "none") {
        alert("Enter phone number and click Allow first!");
        return;
      }*/
      for (let i = 0; i < table.rows.length; i++) {
        const cellType = i === 0 ? "th" : "td";
        const cell = document.createElement(cellType);
        cell.contentEditable = "true"; //make new cells editable
        cell.innerText = i === 0 ? "New Column" : "";
        table.rows[i].appendChild(cell);
      }
    };
    const delRowBtn = document.createElement("button");
    delRowBtn.innerHTML = '<i class="fa-solid fa-minus delete-icon"></i>row';
    delRowBtn.setAttribute("data-tooltip", "Delete Last Row");
    delRowBtn.onclick = () => {
      if (table.rows.length > 2) {
        // keep header + at least one row
        table.deleteRow(table.rows.length - 1);
      } else {
        showToast("Cannot delete all rows!", "error");
      }
    };

    const delColBtn = document.createElement("button");
    delColBtn.innerHTML = '<i class="fa-solid fa-minus delete-icon"></i>col';
    delColBtn.setAttribute("data-tooltip", "Delete Last Column");
    delColBtn.onclick = () => {
      if (table.rows[0].cells.length > 1) {
        // keep at least one column
        for (let r = 0; r < table.rows.length; r++) {
          table.rows[r].deleteCell(table.rows[r].cells.length - 1);
        }
      } else {
        showToast("Cannot delete all columns!", "error");
      }
    };
    const downloadBtn = document.createElement("button");
    downloadBtn.innerHTML = '<i class="fa-solid fa-download save-icon"></i>';
    downloadBtn.setAttribute("data-tooltip", "Download Table");
    downloadBtn.onclick = () => {
      let csv = [];
      for (let i = 0; i < table.rows.length; i++) {
        let row = [];
        for (let j = 0; j < table.rows[i].cells.length; j++) {
          row.push(table.rows[i].cells[j].innerText.replace(/,/g, "")); // avoid CSV issues
        }
        csv.push(row.join(","));
      }
      const blob = new Blob([csv.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    };

    controlBar.appendChild(delRowBtn);
    controlBar.appendChild(delColBtn);
    controlBar.appendChild(downloadBtn);
    controlBar.appendChild(addRowBtn);
    controlBar.appendChild(addColBtn);
    controls.appendChild(controlBar);
    contentDiv.appendChild(controls);

    block.appendChild(titleDiv);
    block.appendChild(contentDiv);
    wrapper.appendChild(block);

    document.getElementById("tableTitle").value = "";
  }
  function attachTableLogic(table) {
    table.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return; // only run on Enter
      e.preventDefault();
      const cell = e.target;
      const text = cell.innerText.trim().toLowerCase();
      const row = cell.parentElement;
      const colIndex = cell.cellIndex;

      // Skip header row itself
      if (row.rowIndex === 0) return;
      // ✅ ADD THIS BLOCK HERE
      const rowVals = [];
      for (let i = 0; i < row.cells.length; i++) {
        if (i === colIndex) continue;
        const val = parseFloat(row.cells[i].innerText);
        if (!isNaN(val)) rowVals.push(val);
      }

      const colVals = [];
      for (let r = 1; r < table.rows.length; r++) {
        if (r === row.rowIndex) continue;
        const val = parseFloat(table.rows[r].cells[colIndex]?.innerText);
        if (!isNaN(val)) colVals.push(val);
      }
      // --- Unified handler ---
      if (["@date", "@month", "@year"].includes(text)) {
        handleSequence(table, row, colIndex, text, cell);
      }

      // --- ADD (sum) ---
      if (text === "add") {
        const rowSum = rowVals.reduce((a, b) => a + b, 0);
        const colSum = colVals.reduce((a, b) => a + b, 0);
        cell.innerText = rowVals.length >= colVals.length ? rowSum : colSum;
        return;
      }

      // --- AVG (average) ---
      if (text === "avg") {
        const rowAvg = rowVals.length
          ? rowVals.reduce((a, b) => a + b, 0) / rowVals.length
          : 0;
        const colAvg = colVals.length
          ? colVals.reduce((a, b) => a + b, 0) / colVals.length
          : 0;
        cell.innerText =
          rowVals.length >= colVals.length
            ? rowAvg.toFixed(2)
            : colAvg.toFixed(2);
        return;
      }
      // --- MUL (multiplication) ---
      if (text === "mul") {
        const rowProduct = rowVals.length
          ? rowVals.reduce((a, b) => a * b, 1)
          : 0;
        const colProduct = colVals.length
          ? colVals.reduce((a, b) => a * b, 1)
          : 0;
        cell.innerText =
          rowVals.length >= colVals.length ? rowProduct : colProduct;
        return;
      }
      // --- MIN ---
      if (text === "min") {
        const rowMin = rowVals.length ? Math.min(...rowVals) : 0;
        const colMin = colVals.length ? Math.min(...colVals) : 0;
        cell.innerText = rowVals.length >= colVals.length ? rowMin : colMin;
        return;
      }

      // --- MAX ---
      if (text === "max") {
        const rowMax = rowVals.length ? Math.max(...rowVals) : 0;
        const colMax = colVals.length ? Math.max(...colVals) : 0;
        cell.innerText = rowVals.length >= colVals.length ? rowMax : colMax;
        return;
      }
      // --- DELETE COMMANDS ---
      if (text.startsWith("@del")) {
        const parts = text.split(" ");
        if (parts.length >= 3) {
          const target = parts[1]; // command = delete row / column / cell
          const index = parts[2]; // number or coordinates

          // Delete row
          if (target === "row") {
            const rowIndex = parseInt(index, 10);
            if (
              !isNaN(rowIndex) &&
              rowIndex > 0 &&
              rowIndex < table.rows.length
            ) {
              const deletedRow = [];
              for (let c = 0; c < table.rows[rowIndex].cells.length; c++) {
                deletedRow.push(table.rows[rowIndex].cells[c].innerText);
              }
              actionHistory.push({
                type: "row",
                index: rowIndex,
                data: deletedRow,
              });
              table.deleteRow(rowIndex);
            }
          }

          // Delete column
          if (target === "column") {
            const colIndex = parseInt(index, 10);
            if (
              !isNaN(colIndex) &&
              colIndex >= 0 &&
              colIndex < table.rows[0].cells.length
            ) {
              const deletedCol = [];
              for (let r = 0; r < table.rows.length; r++) {
                deletedCol.push(table.rows[r].cells[colIndex].innerText);
              }
              actionHistory.push({
                type: "column",
                index: colIndex,
                data: deletedCol,
              });
              for (let r = 0; r < table.rows.length; r++) {
                table.rows[r].deleteCell(colIndex);
              }
            }
          }

          // Delete specific cell: "delete cell row,col"
          if (target === "cell" && parts[2]) {
            const coords = parts[2].split(",");
            if (coords.length === 2) {
              const rIndex = parseInt(coords[0], 10);
              const cIndex = parseInt(coords[1], 10);
              if (
                !isNaN(rIndex) &&
                !isNaN(cIndex) &&
                rIndex > 0 &&
                rIndex < table.rows.length &&
                cIndex >= 0 &&
                cIndex < table.rows[rIndex].cells.length
              ) {
                const oldValue = table.rows[rIndex].cells[cIndex].innerText;
                actionHistory.push({
                  type: "cell",
                  row: rIndex,
                  col: cIndex,
                  data: oldValue,
                });
                table.rows[rIndex].cells[cIndex].innerText = "";
              }
            }
          }
        }

        // Clear the command cell itself
        cell.innerText = "";
      }
      // --- UNDO ---
      if (text === "undo") {
        const last = actionHistory.pop();
        if (!last) {
          cell.innerText = "Nothing to undo";
          return;
        }

        if (last.type === "row") {
          const newRow = table.insertRow(last.index);
          for (let i = 0; i < last.data.length; i++) {
            const newCell = newRow.insertCell();
            newCell.contentEditable = "true";
            newCell.innerText = last.data[i];
          }
        }

        if (last.type === "column") {
          for (let r = 0; r < table.rows.length; r++) {
            const newCell = table.rows[r].insertCell(last.index);
            newCell.contentEditable = "true";
            newCell.innerText = last.data[r];
          }
        }

        if (last.type === "cell") {
          table.rows[last.row].cells[last.col].innerText = last.data;
        }

        cell.innerText = ""; // clear command cell
      }
    });
  }
  function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;

    container.appendChild(toast);

    // show animation
    setTimeout(() => toast.classList.add("show"), 100);

    // auto remove
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => container.removeChild(toast), 300);
    }, 3000);
  }
  function renderTable(tableData) {
    socket.emit("joinTable", tableData._id);
    const wrapper = document.getElementById("tablesWrapper");

    const block = document.createElement("div");
    block.className = "table-block";

    // ================= TITLE =================
    const titleDiv = document.createElement("div");
    titleDiv.className = "table-title";

    const titleSpan = document.createElement("span");
    titleSpan.innerHTML = "▶ " + tableData.title;

    // ================= CONTENT WRAPPER =================
    const contentDiv = document.createElement("div");
    contentDiv.className = "table-content";
    contentDiv.style.display = "none"; // collapsed by default

    titleSpan.onclick = () => {
      const isHidden = contentDiv.style.display === "none";
      contentDiv.style.display = isHidden ? "block" : "none";
      titleSpan.innerHTML = (isHidden ? "▼ " : "▶ ") + tableData.title;
    };
            const currentUserId = localStorage.getItem("userId");
          const isOwner = tableData.user === currentUserId;
           const sharedUser = tableData.sharedWith?.find(
             u => u.user === currentUserId
           );

      if (!isOwner && sharedUser) {
       const badge = document.createElement("span");
        badge.innerText = sharedUser.permission === "view" ? "🔒 Read Only" : "✏️ Editable";
         badge.style.marginLeft = "10px";
           badge.style.color = sharedUser.permission === "view" ? "red" : "green";

           titleDiv.appendChild(badge);
       }
    // ================= TABLE =================
    const table = document.createElement("table");
    attachTableLogic(table);
    tableData.data.forEach((rowData, i) => {
      const row = table.insertRow();

      rowData.forEach((cellData, j) => {
        const cell = i === 0 ? document.createElement("th") : row.insertCell();

        cell.innerText = cellData;
        cell.contentEditable = "true"; // locked by default

        row.appendChild(cell);
      });
    });

    // ================= SCROLL =================
    const scrollDiv = document.createElement("div");
    scrollDiv.className = "table-scroll";
    scrollDiv.appendChild(table);
    contentDiv.appendChild(scrollDiv);

    // ================= CONTROLS =================
    const controls = document.createElement("div");
    controls.className = "controls";

    // const controlBar = document.createElement("div");
    // controlBar.className = "button-bar";
    const buttonBar = document.createElement("div");
    buttonBar.className = "button-bar";
    // ===== ADD ROW =====
    const addRowBtn = document.createElement("button");
    addRowBtn.innerHTML = '<i class="fa-solid fa-plus add-icon"></i> Row';
    addRowBtn.setAttribute("data-tooltip", "Add Row");
    //addRowBtn.innerText = "+ Row";
    addRowBtn.onclick = () => {
      const row = table.insertRow();
      for (let i = 0; i < table.rows[0].cells.length; i++) {
        const cell = row.insertCell();
        cell.contentEditable = "true";
      }
    };

    // ===== ADD COLUMN =====
    const addColBtn = document.createElement("button");
    addColBtn.innerHTML = '<i class="fa-solid fa-plus add-icon"></i> Col';
    addColBtn.setAttribute("data-tooltip", "Add Column");
    //addColBtn.innerText = "+ Col";
    addColBtn.onclick = () => {
      for (let i = 0; i < table.rows.length; i++) {
        const cellType = i === 0 ? "th" : "td";
        const cell = document.createElement(cellType);
        cell.contentEditable = "true";
        cell.innerText = i === 0 ? "New Column" : "";
        table.rows[i].appendChild(cell);
      }
    };

    // ===== DELETE ROW =====
    const delRowBtn = document.createElement("button");
    // delRowBtn.innerText = "- Row";
    delRowBtn.innerHTML = '<i class="fa-solid fa-minus delete-icon"></i> Row';
    delRowBtn.setAttribute("data-tooltip", "Delete Last Row");
    delRowBtn.onclick = () => {
      if (table.rows.length > 2) {
        table.deleteRow(table.rows.length - 1);
      } else {
        showToast("Cannot delete all rows!", "error");
      }
    };

    // ===== DELETE COLUMN =====
    const delColBtn = document.createElement("button");
    //delColBtn.innerText = "- Col";
    delColBtn.innerHTML = '<i class="fa-solid fa-minus delete-icon"></i> Col';
    delColBtn.setAttribute("data-tooltip", "Delete Last Column");
    delColBtn.onclick = () => {
      if (table.rows[0].cells.length > 1) {
        for (let r = 0; r < table.rows.length; r++) {
          table.rows[r].deleteCell(table.rows[r].cells.length - 1);
        }
      } else {
        showToast("Cannot delete all columns!", "error");
      }
    };

    // ===== EDIT =====
    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fa-solid fa-pen edit-icon"></i>';
    //editBtn.title = "Edit";
    editBtn.setAttribute("data-tooltip", "Edit Table");
    editBtn.onclick = () => {
      lockTable(table, false);
    };

    // ===== SAVE (UPDATE API) =====
    const saveBtn = document.createElement("button");
    saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk save-icon"></i>';
    //saveBtn.title = "Save";
    saveBtn.setAttribute("data-tooltip", "Save Table");

    saveBtn.onclick = async () => {
      const updatedData = extractTableData(table);

      try {
        const res = await fetch(
          `https://api.buildskil.com/api/tables/${tableData._id}`,
          {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify({
              title: tableData.title,
              data: updatedData,
            }),
          },
        );
        const data = await res.json();

        if (!res.ok) {
          showToast(data.message); // backend message
          return;
        }
        lockTable(table, true);
        showToast("Updated successfully!");
      } catch (err) {
        //console.error(err);
        showToast("Update failed", "error");
      }
    };

    // ===== DELETE (API) =====
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash delete-icon"></i>';
    //deleteBtn.title = "Delete";
    deleteBtn.setAttribute("data-tooltip", "Delete Table");

    deleteBtn.onclick = async () => {
      const confirmed = confirm(
        "Are you sure you want to delete this table? This action cannot be undone.",
      );
      if (!confirmed) return;

      try {
        const res = await fetch(
          `https://api.buildskil.com/api/tables/${tableData._id}`,
          {
            method: "DELETE",
            headers: authHeaders(),
          },
        );
        const data = await res.json();
        if (!res.ok) {
          showToast(data.message, "error"); // ✅ show backend message
          return;
        }
        block.remove();
      } catch (err) {
        //console.error(err);
        showToast("Delete failed", "error");
      }
    };
    const downloadBtn = document.createElement("button");
    downloadBtn.innerHTML = '<i class="fa-solid fa-download save-icon"></i>';
    downloadBtn.setAttribute("data-tooltip", "Download Table");
    downloadBtn.onclick = () => {
      let csv = [];
      for (let i = 0; i < table.rows.length; i++) {
        let row = [];
        for (let j = 0; j < table.rows[i].cells.length; j++) {
          row.push(table.rows[i].cells[j].innerText.replace(/,/g, "")); // avoid CSV issues
        }
        csv.push(row.join(","));
      }
      const blob = new Blob([csv.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `table_data.csv`;
      a.click();
      URL.revokeObjectURL(url);
    };
    socket.on("tableUpdated", (update) => {
      if (update.tableId !== tableData._id) return;

      // 🔥 update UI
      for (let i = 0; i < update.data.length; i++) {
        for (let j = 0; j < update.data[i].length; j++) {
          if (table.rows[i] && table.rows[i].cells[j]) {
            table.rows[i].cells[j].innerText = update.data[i][j];
          }
        }
      }
    });
    // ================= APPEND CONTROLS =================
    // ================= BUTTON BAR =================
    buttonBar.className = "button-bar";

    buttonBar.appendChild(saveBtn);
    buttonBar.appendChild(editBtn);
    buttonBar.appendChild(addRowBtn);
    buttonBar.appendChild(addColBtn);
    buttonBar.appendChild(delRowBtn);
    buttonBar.appendChild(delColBtn);
    buttonBar.appendChild(deleteBtn);
    buttonBar.appendChild(downloadBtn);

    // ================= HEADER =================
    titleDiv.appendChild(titleSpan);
    titleDiv.appendChild(buttonBar); // ✅ NOW IN HEADER

    // ================= BODY =================
    contentDiv.appendChild(scrollDiv);

    // ================= FINAL =================
    block.appendChild(titleDiv);
    block.appendChild(contentDiv);

    wrapper.appendChild(block);
    //controls.appendChild(buttonBar);
    //contentDiv.appendChild(controls);
  }
  function extractTableData(table) {
    const data = [];
    for (let i = 0; i < table.rows.length; i++) {
      const row = [];
      for (let j = 0; j < table.rows[i].cells.length; j++) {
        row.push(table.rows[i].cells[j].innerText);
      }
      data.push(row);
    }
    return data;
  }
  function lockTable(table, lock) {
    for (let i = 1; i < table.rows.length; i++) {
      for (let j = 0; j < table.rows[i].cells.length; j++) {
        table.rows[i].cells[j].contentEditable = lock ? "false" : "true";
      }
    }
  }
  // Unified sequence filler
  function handleSequence(table, row, colIndex, type, cell) {
    const now = new Date();

    // Formatters
    const formatDate = (d) => {
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yy = String(d.getFullYear()).slice(-2);
      return `${dd}/${mm}/${yy}`;
    };
    const formatMonthName = (d) => {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    };

    // Set header label
    const headerLabel =
      type === "@date" ? "Date" : type === "@month" ? "Month" : "Year";
    table.rows[0].cells[colIndex].innerText = headerLabel;

    // Set current cell
    if (type === "@date") cell.innerText = formatDate(now);
    if (type === "@month") cell.innerText = formatMonthName(now);
    if (type === "@year") cell.innerText = now.getFullYear();

    // Fill upwards
    let prev = new Date(now);
    let prevYear = now.getFullYear();
    for (let r = row.rowIndex - 1; r > 0; r--) {
      const targetCell = table.rows[r].cells[colIndex];
      if (targetCell.innerText.trim()) break; // stop if filled
      if (type === "@date") {
        prev.setDate(prev.getDate() - 1);
        targetCell.innerText = formatDate(prev);
      }
      if (type === "@month") {
        prev.setMonth(prev.getMonth() - 1);
        targetCell.innerText = formatMonthName(prev);
      }
      if (type === "@year") {
        prevYear -= 1;
        targetCell.innerText = prevYear;
      }
    }

    // Fill downwards
    let next = new Date(now);
    let nextYear = now.getFullYear();
    for (let r = row.rowIndex + 1; r < table.rows.length; r++) {
      const targetCell = table.rows[r].cells[colIndex];
      if (targetCell.innerText.trim()) break; // stop if filled
      if (type === "@date") {
        next.setDate(next.getDate() + 1);
        targetCell.innerText = formatDate(next);
      }
      if (type === "@month") {
        next.setMonth(next.getMonth() + 1);
        targetCell.innerText = formatMonthName(next);
      }
      if (type === "@year") {
        nextYear += 1;
        targetCell.innerText = nextYear;
      }
    }

    // Add new row if last
    if (row.rowIndex === table.rows.length - 1) {
      const newRow = table.insertRow();
      for (let i = 0; i < table.rows[0].cells.length; i++) {
        const newCell = newRow.insertCell();
        newCell.contentEditable = "true";
        if (i === colIndex) {
          if (type === "@date") {
            next.setDate(next.getDate() + 1);
            newCell.innerText = formatDate(next);
          }
          if (type === "@month") {
            next.setMonth(next.getMonth() + 1);
            newCell.innerText = formatMonthName(next);
          }
          if (type === "@year") {
            nextYear += 1;
            newCell.innerText = nextYear;
          }
        }
      }
    }
  }

  async function loadTables() {
    try {
      const res = await fetch("https://api.buildskil.com/api/tables", {
        headers: authHeaders(),
      });

      const tables = await res.json();
      userTables = tables; // ✅ STORE HERE
      // ✅ UPDATE LIMIT UI
      const limitDiv = document.getElementById("tableLimitInfo");

      const count = userTables.length;
      const max = 30;

      limitDiv.innerText = `Tables: ${count}/${max} used`;

      limitDiv.className =
        "table-limit " + (count >= max ? "limit-full" : "limit-ok");
      const wrapper = document.getElementById("tablesWrapper");
      wrapper.innerHTML = ""; // clear old UI

      tables.forEach((table) => {
        renderTable(table);
      });
    } catch (err) {
      console.error("Load error:", err);
    }
  }
  loadTables(); // 👈 important
});

/***
 * // Delete row by index
const rowIndexInput = document.createElement('input');
rowIndexInput.type = 'number';
rowIndexInput.placeholder = 'Row #';

const delRowBtn = document.createElement('button');
delRowBtn.innerHTML = '<i class="fa-solid fa-minus delete-icon"></i>';
delRowBtn.setAttribute("data-tooltip", "Delete Row by Index");
delRowBtn.onclick = () => {
  const idx = parseInt(rowIndexInput.value);
  if (!isNaN(idx) && idx > 0 && idx < table.rows.length) {
    table.deleteRow(idx);
  } else {
    alert("Invalid row index!");
  }
};

// Delete column by index
const colIndexInput = document.createElement('input');
colIndexInput.type = 'number';
colIndexInput.placeholder = 'Col #';

const delColBtn = document.createElement('button');
delColBtn.innerHTML = '<i class="fa-solid fa-minus delete-icon"></i>';
delColBtn.setAttribute("data-tooltip", "Delete Column by Index");
delColBtn.onclick = () => {
  const idx = parseInt(colIndexInput.value);
  if (!isNaN(idx) && idx >= 0 && idx < table.rows[0].cells.length) {
    for (let r = 0; r < table.rows.length; r++) {
      table.rows[r].deleteCell(idx);
    }
  } else {
    alert("Invalid column index!");
  }
};

controlBar.appendChild(rowIndexInput);
controlBar.appendChild(delRowBtn);
controlBar.appendChild(colIndexInput);
controlBar.appendChild(delColBtn);
 */
