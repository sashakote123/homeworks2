interface Task {
  id: number;
  name: string;
  info?: string;
  isCompleted?: boolean;
  isImportant?: boolean;
}

interface CreateTaskData {
  name: string;
  info?: string;
  isCompleted?: boolean;
}

interface UpdateTaskData {
  name?: string;
  info?: string;
  isCompleted?: boolean;
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

abstract class HttpEngine {
  constructor(protected baseURL: string = 'https://tasks-service-maks1394.amvera.io') {}

  protected logRequest(method: HttpMethod, url: string, data: unknown = null): void {
    console.log(`${method} ${url}`, data ? `Data: ${JSON.stringify(data)}` : '');
  }

  protected logResponse(method: HttpMethod, url: string, response: unknown): void {
    console.log(`${method} ${url}`, `Response:`, response);
  }

  protected logError(method: HttpMethod, url: string, error: Error): void {
    console.error(`${method} ${url}`, `Error:`, error);
  }

  abstract request<T = unknown>(method: HttpMethod, url: string, data?: unknown): Promise<T>;
}

class FetchEngine extends HttpEngine {
  async request<T = unknown>(method: HttpMethod, url: string, data: unknown = null): Promise<T> {
    const fullUrl = `${this.baseURL}${url}`;
    this.logRequest(method, fullUrl, data);

    try {
      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
        config.body = JSON.stringify(data);
      }

      const response: Response = await fetch(fullUrl, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: T = await response.json();
      this.logResponse(method, fullUrl, result);
      return result;
    } catch (error) {
      this.logError(method, fullUrl, error as Error);
      throw error;
    }
  }
}

interface IApiController {
  getAllTasks(): Promise<Task[]>;
  createTask(taskData: CreateTaskData): Promise<Task>;
  getTaskById(id: number): Promise<Task>;
  updateTask(id: number, updateData: UpdateTaskData): Promise<Task>;
  deleteTask(id: number): Promise<void>;
}

class ApiController implements IApiController {
  constructor(private engine: HttpEngine) {
    if (!engine) {
      throw new Error('Engine is required');
    }
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.engine.request<Task[]>('GET', '/tasks');
  }

  async createTask(taskData: CreateTaskData): Promise<Task> {
    return await this.engine.request<Task>('POST', '/tasks', taskData);
  }

  async getTaskById(id: number): Promise<Task> {
    return await this.engine.request<Task>('GET', `/tasks/${id}`);
  }

  async updateTask(id: number, updateData: UpdateTaskData): Promise<Task> {
    return await this.engine.request<Task>('PATCH', `/tasks/${id}`, updateData);
  }

  async deleteTask(id: number): Promise<void> {
    await this.engine.request<void>('DELETE', `/tasks/${id}`);
  }
}

const engine = new FetchEngine();

// Список тасок
const btn1 = document.querySelector('#btn1') as HTMLButtonElement;
const tasksList = document.querySelector('#tasksList') as HTMLUListElement;

btn1.onclick = async (): Promise<void> => {
  const fetchController = new ApiController(engine);

  try {
    const tasks = await fetchController.getAllTasks();
    for (const el of tasks) {
      const task = document.createElement('li');
      task.className = 'list-group-item';
      task.innerHTML = `<p class="mb-1">${el.id}: ${el.name}</p><div class="text-muted small">${el.info}</div>`;
      tasksList.append(task);
    }
  } catch (error) {
    console.error(error);
  }
};

// Получить таску
const btn2 = document.querySelector('#btn2') as HTMLButtonElement;
const taskContainer = document.querySelector('#taskContainer') as HTMLDivElement;
const taskForm = document.forms.namedItem('getTaskForm') as HTMLFormElement;

btn2.onclick = async (): Promise<void> => {
  const fetchController = new ApiController(engine);

  const taskId = (taskForm.elements.namedItem('taskId') as HTMLInputElement).value;

  try {
    const task = await fetchController.getTaskById(Number(taskId));
    const taskInfo = document.createElement('div');
    taskInfo.innerHTML = `<p>${task.name}</p><div>${task.info}</div>`;
    taskContainer.append(taskInfo);
  } catch (error) {
    console.error(error);
  }
};

// Добавить таску
const btn3 = document.querySelector('#btn3') as HTMLButtonElement;
const addTaskForm = document.forms.namedItem('addTaskForm') as HTMLFormElement;

btn3.onclick = async (): Promise<void> => {
  const fetchController = new ApiController(engine);

  const taskName = (addTaskForm.elements.namedItem('taskName') as HTMLInputElement).value;
  const taskDesc = (addTaskForm.elements.namedItem('taskDesc') as HTMLInputElement).value;
  const taskFlag = (addTaskForm.elements.namedItem('taskFlag') as HTMLInputElement).checked;

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
const btn4 = document.querySelector('#btn4') as HTMLButtonElement;
const updateTaskForm = document.forms.namedItem('updateTaskForm') as HTMLFormElement;

btn4.onclick = async (): Promise<void> => {
  const fetchController = new ApiController(engine);

  const taskId = (updateTaskForm.elements.namedItem('taskId') as HTMLInputElement).value;
  const taskName = (updateTaskForm.elements.namedItem('taskName') as HTMLInputElement).value;
  const taskDesc = (updateTaskForm.elements.namedItem('taskDesc') as HTMLInputElement).value;
  const taskFlag = (updateTaskForm.elements.namedItem('taskFlag') as HTMLInputElement).checked;
  const taskFlag2 = (updateTaskForm.elements.namedItem('taskFlag2') as HTMLInputElement).checked;

  const respData = {
    name: taskName,
    info: taskDesc,
    isImportant: taskFlag,
    isCompleted: taskFlag2,
  };
  try {
    await fetchController.updateTask(Number(taskId), respData);
  } catch (error) {
    console.error(error);
  }
};

// Удалить таску
const btn5 = document.querySelector('#btn5') as HTMLButtonElement;
const deleteTaskForm = document.forms.namedItem('deleteTaskForm') as HTMLFormElement;

btn5.onclick = async (): Promise<void> => {
  const fetchController = new ApiController(engine);

  const taskId = (deleteTaskForm.elements.namedItem('taskId') as HTMLInputElement).value;

  try {
    await fetchController.deleteTask(Number(taskId));
  } catch (error) {
    console.error(error);
  }
};
