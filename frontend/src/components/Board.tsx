import { useEffect, useState } from "react";
import { addTask, fetchTasks } from "../services/taskService";
import { Task } from "../types";
import EditModal from "./EditModal";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { RenderTaskList } from "./RenderTaskList";

function Board({ categoryValue, dueValue, searchValue, taskValue, setChanged, changed }: any) {
    const storedUserId = localStorage.getItem('userId');
    const [overDue, setOverview] = useState<Task[]>([]);
    const [_searchText, setSearchText] = useState('');
    const [thisWeek, setThisweek] = useState<Task[]>([]);
    const [todaysTask, setTodaysTasks] = useState<Task[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [originalTasks, setOriginalTasks] = useState<Task[]>([]);
    const [editTaskValue, setEditTaskValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dropdownValue, setDropdownValue] = useState("");


    useEffect(() => {
        if (!taskValue) return;

        const addNewTask = async () => {
            const { file, taskName, text, date, status, category, storedUserId } = taskValue;

            const isTaskDuplicate = tasks.some((task) =>
                task.title === taskName &&
                task.description === text &&
                task.dueDate === date &&
                task.status === status &&
                task.category === category &&
                task.attachments === (file ? file.name : '')
            );

            if (isTaskDuplicate) {
                return;
            }

            let newTaskResponse;
            if (!file) {
                newTaskResponse = await addTask(taskName, text, date, status, category, storedUserId, '');
            } else {
                const storage = getStorage();
                const storageRef = ref(storage, `tasks/${Date.now()}_${file.name}`);
                const uploadSnapshot = await uploadBytes(storageRef, file);

                const fileUrl = await getDownloadURL(uploadSnapshot.ref);

                newTaskResponse = await addTask(taskName, text, date, status, category, storedUserId, fileUrl);
            }

            if (newTaskResponse?.data?.task) {
                const newTask = newTaskResponse.data.task;
                setTasks((prevTasks) => {
                    const isTaskAlreadyInState = prevTasks.some((task) => task._id === newTask._id);
                    if (!isTaskAlreadyInState) {
                        return [...prevTasks, newTask];
                    }
                    return prevTasks;
                });
            } else {
                console.error('Invalid task response', newTaskResponse);
            }
        };

        addNewTask();

        taskValue.taskName = null;
        taskValue.text = null;
        taskValue.dueDate = null;
        taskValue.status = null;
        taskValue.category = null;
        taskValue.file = null;

    }, [taskValue]);

    useEffect(() => {
        const searchKey = searchValue
        setSearchText(searchKey);

        if (searchKey.trim() === '') {
            setTasks(originalTasks);
        } else {
            const filteredTasks = tasks.filter(task =>
                task.title.toLowerCase().includes(searchKey.toLowerCase())
            );
            setTasks(filteredTasks);
        }
    }, [searchValue])
    useEffect(() => {
        if (!storedUserId) return;
        (async () => {
            const response = await fetchTasks(storedUserId);
            setTasks(response);
            setOriginalTasks(response);
            setTodaysTasks(response);
            setOverview(response);
            setThisweek(response);
        })();
    }, [storedUserId, changed]);


    useEffect(() => {

        const filterKey = categoryValue;
        if (!filterKey || filterKey === 'Category') {
            return;
        }
        if (filterKey === 'clearfilter') {
            setTasks(originalTasks);

        } else {
            const filteredTasks = originalTasks.filter(task =>
                task.category.toLowerCase() === filterKey.toLowerCase()
            );
            setTasks(filteredTasks);

        }
    }, [categoryValue])




    useEffect(() => {
        if (!dueValue) return;

        (async () => {
            const currentDate = new Date();
            let filteredTasks;

            if (dueValue === 'all') {
                filteredTasks = originalTasks;
            } else {
                switch (dueValue) {
                    case 'today':
                        filteredTasks = todaysTask.filter(task => {
                            const taskDueDate = new Date(task.dueDate);
                            taskDueDate.setHours(0, 0, 0, 0);
                            currentDate.setHours(0, 0, 0, 0);
                            return taskDueDate.getTime() === currentDate.getTime();
                        });
                        break;

                    case 'overdue':
                        filteredTasks = overDue.filter(task => {
                            const taskDueDate = new Date(task.dueDate);
                            return taskDueDate < currentDate;
                        });
                        break;

                    case 'thisweek':
                        filteredTasks = thisWeek.filter(task => {
                            const taskDueDate = new Date(task.dueDate);
                            const startOfWeek = new Date(currentDate);
                            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
                            startOfWeek.setHours(0, 0, 0, 0);
                            const endOfWeek = new Date(startOfWeek);
                            endOfWeek.setDate(startOfWeek.getDate() + 6);
                            endOfWeek.setHours(23, 59, 59, 999);
                            return taskDueDate >= startOfWeek && taskDueDate <= endOfWeek;
                        });
                        break;

                    default:
                        filteredTasks = tasks;
                }
            }

            setTasks(filteredTasks);
        })();
    }, [dueValue]);

    return (
        <>

            <div className="min-h-screen bg-white px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-200 rounded-md shadow p-4" style={{ minHeight: '400px' }}>
                        <h2 className="text-sm font-bold text-black mb-4 px-4 py-2 rounded-lg inline-block" style={{ backgroundColor: '#FAC3FF' }}>
                            TO-DO
                        </h2>
                        <div className="space-y-4">

                        <RenderTaskList taskListUnfiltered={tasks} status={'TO-DO'} setChanged={setChanged} setTasks={setTasks} setOriginalTasks={setOriginalTasks} setEditTaskValue={setEditTaskValue} setIsModalOpen={setIsModalOpen} setDropdownValue={setDropdownValue} dropdownValue={dropdownValue}></RenderTaskList>
                        </div>
                    </div>

                    <div className="bg-gray-200 rounded-md shadow p-4">
                        <h2 className="text-sm font-bold text-black mb-4 px-4 py-2 rounded-lg inline-block" style={{ backgroundColor: '#85D9F1' }}>
                            IN-PROGRESS
                        </h2>
                        <div className="space-y-4">
                            <RenderTaskList taskListUnfiltered={tasks} status={'IN-PROGRESS'} setChanged={setChanged} setTasks={setTasks} setOriginalTasks={setOriginalTasks} setEditTaskValue={setEditTaskValue} setIsModalOpen={setIsModalOpen} setDropdownValue={setDropdownValue} dropdownValue={dropdownValue}></RenderTaskList>
                        </div>
                    </div>
                    <div className="bg-gray-200 rounded-md shadow p-4">
                        <h2 className="text-sm font-bold text-black mb-4 px-4 py-2 rounded-lg inline-block" style={{ backgroundColor: '#CEFFCC' }}>
                            COMPLETED
                        </h2>
                        <div className={`space-y-4 ${tasks.filter(task => task.status === 'completed').length === 0 ? '' : 'line-through'}`}>
                            {/* {<RenderTaskList taskList></RenderTaskList>(tasks.filter(task => task.status === 'completed'), ['COMPLETED'])} */}
                            <RenderTaskList taskListUnfiltered={tasks} status={'COMPLETED'} setChanged={setChanged} setTasks={setTasks} setOriginalTasks={setOriginalTasks} setEditTaskValue={setEditTaskValue} setIsModalOpen={setIsModalOpen} setDropdownValue={setDropdownValue} dropdownValue={dropdownValue}></RenderTaskList>                        </div>
                    </div>


                </div>
                {isModalOpen && (
                    <EditModal modalValue={setIsModalOpen} editValue={editTaskValue} setTasksValue={setTasks} setOriginalTasks={setOriginalTasks} />
                )}
            </div>
        </>
    );
}

export default Board;
