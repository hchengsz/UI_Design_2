// model layer
const model = {
    // todo {checked: boolean, value: string, id: string}
    todoList: [],
    storeList: []
};

function createId() {
    return new Date().toISOString();
}

function getTodoList() {
    return model.todoList;
}

// controllers

function addNewTask() {
    const value = getAddInputValue();
    const checked = false;
    const newId = createId();
    const newTodo = {
        checked: checked,
        value: value,
        id: newId
    };

    model.todoList.push(newTodo);
    model.storeList = model.todoList;
    localStorage.setItem("storeList", JSON.stringify(model.storeList));
    updateView();
}

function editTask(id) {
    const todoList = getTodoList();
    const input = document.querySelector(".edit-input");
    const inputValue = input.value;

    todoList.forEach(function(todo) {
        if (todo.id === id) {
            todo.value = inputValue;
        }
    });
    localStorage.setItem("storeList", JSON.stringify(model.storeList));
    updateView();
}

function deleteAllTasks() {
    model.todoList = [];
    model.storeList = [];
    localStorage.setItem("storeList", JSON.stringify(model.storeList));
    updateView();
}

function deleteTaskById(id) {
    const filteredList = model.todoList.filter(function(todo) {
        return todo.id !== id;
    });
    model.todoList = filteredList;

    const filteredList2 = model.storeList.filter(function(todo) {
        return todo.id !== id;
    });
    model.storeList = filteredList2;
    localStorage.setItem("storeList", JSON.stringify(model.storeList));
    updateView();
}

function editTaskById(id) {
    const listContainer = getListContainer();

    listContainer.innerHTML = "";
    const todoList = getTodoList();

    todoList.forEach(function(todo) {
        if (todo.id === id) {
            const liNode1 = createEditNode(todo.value, todo.checked, todo.id);
            listContainer.appendChild(liNode1);
        } else {
            const liNode2 = createTaskNode(todo.value, todo.checked, todo.id);
            listContainer.appendChild(liNode2);
        }
    });
    return;
}

function toggleTaskById(id) {
    const newList = model.todoList.map(function(todo) {
        if (todo.id === id) {
            todo.checked = !todo.checked;
            return todo;
        } else {
            return todo;
        }
    });
    model.todoList = newList;
    localStorage.setItem("storeList", JSON.stringify(model.storeList));
    updateView();
}

function selectAllOrUnselect(newList) {
    let checkAll = false;
    newList.forEach(function(newList, index, array) {
        if (newList.checked === false) {
            checkAll = true;
        }
    });

    if (checkAll === true) {
        newList.forEach(function(newList, index, array) {
            newList.checked = true;
            updateView();
        });
    } else if (checkAll === false) {
        newList.forEach(function(newList, index, array) {
            newList.checked = false;
            updateView();
        });
    }
    return;
}

function showActiveItem() {
    model.todoList = model.storeList;
    const filteredList = model.todoList.filter(function(todo) {
        return todo.checked === false;
    });
    model.todoList = filteredList;
    updateView();
}

function showCompletedItem() {
    model.todoList = model.storeList;
    const filteredList = model.todoList.filter(function(todo) {
        return todo.checked === true;
    });
    model.todoList = filteredList;
    updateView();
}

function showAllItem() {
    model.todoList = model.storeList;
    updateView();
}

// views

function getListContainer() {
    return document.querySelector(".list-container");
}

function createTaskNode(value, checked, id) {
    const li = document.createElement("li");

    li.id = id;

    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.checked = checked; // DOM API to set checked status

    const span = document.createElement("span");
    if (checked) {
        span.classList.add("checked");
    }
    span.innerHTML = value;
    if (checked) {
        span.classList.add("checked");
    }

    const div2 = document.createElement("div");
    div2.innerHTML = "&#9998;";
    div2.classList.add("edit-icon");

    const div = document.createElement("div");
    div.innerHTML = "&#10005;";
    div.classList.add("delete-icon");

    li.appendChild(input);
    li.appendChild(span);
    li.appendChild(div2);
    li.appendChild(div);
    return li;
}

function createEditNode(value, checked, id) {
    const li = document.createElement("li");

    li.id = id;

    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.checked = checked; // DOM API to set checked status
    input.disabled = true;

    const span = document.createElement("span");
    span.innerHTML = `<input class="edit-input" id="editInput" value=${value} />`;

    const div = document.createElement("div");
    div.innerHTML = "&#10003;";
    div.classList.add("check-icon");
    div.id = "checkIcon"

    li.appendChild(input);
    li.appendChild(span);
    li.appendChild(div);
    return li;
}

function updateList() {
    const listContainer = getListContainer();

    listContainer.innerHTML = "";

    const todoList = getTodoList();
    todoList.forEach(function(todo) {
        const liNode = createTaskNode(todo.value, todo.checked, todo.id);
        listContainer.appendChild(liNode);
    });

    let times = getActiveNum();
    document.getElementById("p1").innerHTML = `${times}  items left`;

}

function updateView() {
    updateList();
}

function getAddInputValue() {
    const input = document.querySelector(".text-input");
    const inputValue = input.value;
    document.getElementById("input").value = "";
    return inputValue;
}

function getActiveNum() {
    let count = 0;

    model.storeList.forEach(function(list) {
        if (list.checked === false) {
            count++;
        }
    });
    return count;
}

function handleContainerClick(e) {
    const target = e.target;
    if (target.classList.contains("delete-icon")) {
        // target is the delete icon div
        const li = target.parentNode;
        const taskId = li.id;
        deleteTaskById(taskId);
        return;
    }

    if (target.classList.contains("edit-input")) {
        if (e.keyCode === 13) {
            document.getElementById("checkIcon").click();
        }
        return;
    }

    if (target.classList.contains("edit-icon")) {
        const li = target.parentNode;
        const taskId = li.id;
        editTaskById(taskId);
        const editInput = document.getElementById("editInput")
        editInput.focus();
        editInput.selectionStart = editInput.selectionEnd = editInput.value.length;
        return;
    }

    if (target.classList.contains("check-icon")) {
        const li = target.parentNode;
        const taskId = li.id;
        editTask(taskId);
        return;
    }

    if (
        target.tagName === "INPUT" &&
        target.getAttribute("type") === "checkbox"
    ) {
        const li = target.parentNode;
        const taskId = li.id;
        toggleTaskById(taskId);
        return;
    }

    if (e.keyCode === 13) {
        document.getElementById("addButton").click();
        e.preventDefault();
        return;
    }

    if (target.classList.contains("icon")) {
        const newList = model.todoList
        selectAllOrUnselect(newList)
        return;
    }
}

function loadEvents() {
    model.storeList = JSON.parse(localStorage.getItem("storeList"));
    model.todoList = model.storeList;
    updateView()

    const addButton = document.querySelector("#addButton");
    const clearAllButton = document.querySelector("#clearButton");
    const listContainer = getListContainer();
    const inputLine = document.getElementById("input");
    const selectForAll = document.querySelector("#selectAll");
    const allItem = document.querySelector("#allItem");
    const activeItem = document.querySelector("#activeItem");
    const completedItem = document.querySelector("#completedItem");

    addButton.addEventListener("click", addNewTask);
    clearAllButton.addEventListener("click", deleteAllTasks);
    listContainer.addEventListener("click", handleContainerClick);
    listContainer.addEventListener("keyup", handleContainerClick);
    inputLine.addEventListener("keyup", handleContainerClick);
    selectForAll.addEventListener("click", handleContainerClick);
    activeItem.addEventListener("click", showActiveItem);
    completedItem.addEventListener("click", showCompletedItem);
    allItem.addEventListener("click", showAllItem);
}

loadEvents();