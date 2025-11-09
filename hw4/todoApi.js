class HttpEngine {
  constructor(baseURL = "https://tasks-service-maks1394.amvera.io") {
    this.baseURL = baseURL;
  }

  logRequest(method, url, data = null) {
    console.log(
      `${method} ${url}`,
      data ? `Data: ${JSON.stringify(data)}` : ""
    );
  }

  logResponse(method, url, response) {
    console.log(`${method} ${url}`, `Response:`, response);
  }

  logError(method, url, error) {
    console.error(`${method} ${url}`, `Error:`, error);
  }
}

class FetchEngine extends HttpEngine {
  async request(method, url, data = null) {
    const fullUrl = `${this.baseURL}${url}`;
    this.logRequest(method, fullUrl, data);

    try {
      const config = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (data && (method === "POST" || method === "PATCH")) {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(fullUrl, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      this.logResponse(method, fullUrl, result);
      return result;
    } catch (error) {
      this.logError(method, fullUrl, error);
      throw error;
    }
  }
}

class XhrEngine extends HttpEngine {
  request(method, url, data = null) {
    return new Promise((resolve, reject) => {
      const fullUrl = `${this.baseURL}${url}`;
      this.logRequest(method, fullUrl, data);

      const xhr = new XMLHttpRequest();
      xhr.open(method, fullUrl);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = xhr.responseText
            ? JSON.parse(xhr.responseText)
            : null;
          this.logResponse(method, fullUrl, response);
          resolve(response);
        } else {
          const error = new Error(`HTTP error! status: ${xhr.status}`);
          this.logError(method, fullUrl, error);
          reject(error);
        }
      };

      xhr.onerror = () => {
        const error = new Error("Network error");
        this.logError(method, fullUrl, error);
        reject(error);
      };

      if (data && (method === "POST" || method === "PATCH")) {
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send();
      }
    });
  }
}

class ApiController {
  constructor(engine) {
    if (!(engine instanceof HttpEngine)) {
      throw new Error("Engine must be an instance of HttpEngine");
    }
    this.engine = engine;
  }

  async getAllTasks() {
    return await this.engine.request("GET", "/tasks");
  }

  async createTask(taskData) {
    return await this.engine.request("POST", "/tasks", taskData);
  }

  async getTaskById(id) {
    return await this.engine.request("GET", `/tasks/${id}`);
  }

  async updateTask(id, updateData) {
    return await this.engine.request("PATCH", `/tasks/${id}`, updateData);
  }

  async deleteTask(id) {
    return await this.engine.request("DELETE", `/tasks/${id}`);
  }
}

// const engine = new FetchEngine();
const engine = new XhrEngine();
// Список тасок
const btn1 = document.querySelector("#btn1");
const tasksList = document.querySelector("#tasksList");

btn1.onclick = async () => {
  const fetchController = new ApiController(engine);

  try {
    const tasks = await fetchController.getAllTasks();
    for (let el of tasks) {
      let task = document.createElement("li");
      task.className = "list-group-item";
      task.innerHTML = `<p class="mb-1">${el.id}: ${el.name}</p><div class="text-muted small">${el.info}</div>`;
      tasksList.append(task);
    }
  } catch (error) {
    console.error(error);
  }
};

// Получить таску
const btn2 = document.querySelector("#btn2");
const taskContainer = document.querySelector("#taskContainer");
const taskForm = document.forms.getTaskForm;

btn2.onclick = async () => {
  const fetchController = new ApiController(engine);

  const taskId = taskForm.taskId.value;

  try {
    const task = await fetchController.getTaskById(taskId);
    let taskInfo = document.createElement("div");
    taskInfo.innerHTML = `<p>${task.name}</p><div>${task.info}</div>`;
    taskContainer.append(taskInfo);
  } catch (error) {
    console.error(error);
  }
};


// Добавить таску
const btn3 = document.querySelector("#btn3");
const addTaskForm = document.forms.addTaskForm;

btn3.onclick = async () => {
  const fetchController = new ApiController(engine);

  const taskName = addTaskForm.taskName.value;
  const taskDesc = addTaskForm.taskDesc.value;
  const taskFlag = addTaskForm.taskFlag.checked;

  const respData = {
    name: taskName,
    info: taskDesc,
    isImportant: taskFlag,
    isCompleted: false,
  };
  try {
    await fetchController.createTask(respData);
  } catch (error) {
    console.error(error);
  }
};

//Обновить таску
const btn4 = document.querySelector("#btn4");
const updateTaskForm = document.forms.updateTaskForm;

btn4.onclick = async () => {
  const fetchController = new ApiController(engine);

  const taskId = updateTaskForm.taskId.value;
  const taskName = updateTaskForm.taskName.value;
  const taskDesc = updateTaskForm.taskDesc.value;
  const taskFlag = updateTaskForm.taskFlag.checked;
  const taskFlag2 = updateTaskForm.taskFlag2.checked;

  const respData = {
    name: taskName,
    info: taskDesc,
    isImportant: taskFlag,
    isCompleted: taskFlag2,
  };
  try {
    await fetchController.updateTask(taskId, respData);
  } catch (error) {
    console.error(error);
  }
};


// Удалить таску
const btn5 = document.querySelector("#btn5");
const deleteTaskForm = document.forms.deleteTaskForm;

btn5.onclick = async () => {
  const fetchController = new ApiController(engine);

  const taskId = deleteTaskForm.taskId.value;

  try {
    await fetchController.deleteTask(taskId);
  } catch (error) {
    console.error(error);
  }
};
