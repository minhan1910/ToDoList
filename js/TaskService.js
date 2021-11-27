export default class TasksService {
    getListTaskApi = function() {
        return axios({
            url: `https://6187f09a057b9b00177f9b28.mockapi.io/api/todolist`,
            method: "GET"
        });
    };

    addTaskApi = function(data) {
        return axios({
            url: `https://6187f09a057b9b00177f9b28.mockapi.io/api/todolist`,
            method: "POST",
            data: data
        });
    };

    getTaskById = function(id) {
        return axios({
            url: `https://6187f09a057b9b00177f9b28.mockapi.io/api/todolist/${id}`,
            method: "GET",
        });
    }

    deleteTaskApi = function(id) {
        return axios({
            url: `https://6187f09a057b9b00177f9b28.mockapi.io/api/todolist/${id}`,
            method: "DELETE",
        });
    }

    updateTaskApi = function(data) {
        return axios({
            url: `https://6187f09a057b9b00177f9b28.mockapi.io/api/todolist/${data.id}`,
            method: "PUT",
            data: data
        });
    }
}