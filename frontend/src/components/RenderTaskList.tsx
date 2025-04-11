import { taskDelete } from "../services/taskService";

export const RenderTaskList = ({ taskListUnfiltered, status, setChanged, dropdownValue, setTasks, setOriginalTasks, setEditTaskValue, setIsModalOpen, setDropdownValue }: any) => {

    const mapStatus = (status: string) => {
        if (status === 'TO-DO') return 'todo';
        if (status === 'IN-PROGRESS') return 'inprogress';
        if (status === 'COMPLETED') return 'completed';
        return status; 
      };
    
      let  statusToCompare = mapStatus(status)

    const taskList = taskListUnfiltered?.filter((task: any) => {

        return task.status === statusToCompare
    })

    if (taskList.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-center text-lg text-gray-500">No tasks in {status}</p>
            </div>
        );
    }
    const formatDate = (date: string) => {
        const taskDate = new Date(date);
        const today = new Date();


        taskDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (taskDate.getTime() === today.getTime()) {
            return 'Today';
        }

        const dateFormatted = taskDate.getDate();
        const monthFormatted = taskDate.getMonth() + 1;
        const yearFormatted = taskDate.getFullYear();
        return `${dateFormatted}/${monthFormatted}/${yearFormatted}`;
    };


    const handleEdit = (e: React.ChangeEvent<HTMLSelectElement>, _id: string) => {
        (async () => {
            const taskId = _id
            const action = e.target.value
            if (action === 'delete') {
                await taskDelete(taskId)
                setTasks((prevTasks: any[]) => prevTasks.filter((task) => task._id !== taskId));
                setOriginalTasks((prevOriginalTasks: any[]) =>
                    prevOriginalTasks.filter((task) => task._id !== taskId)
                );
                setDropdownValue("");
            } else {
                setEditTaskValue(taskId);
                setIsModalOpen(true);
            }
        })()
        setChanged((prev: boolean) => !prev)

    }
    return taskList.map((task: any) => (

        <div
            key={task._id}
            className="bg-white p-4 rounded-md shadow-sm flex flex-col h-full relative"
        >

            <div className="flex justify-between items-start mb-9">
                <h3 className="font-bold text-gray-800">{task.title}</h3>
                <div className="relative">
                    <select
                        value={dropdownValue}
                        onChange={(e) => handleEdit(e, task._id)}
                        className="appearance-none font-bold rounded-lg py-2 px-4 pr-10 "
                    >
                        <option selected disabled value="" className="text-gray-500 text-right">
                            ...
                        </option>
                        <option className=" bg-[#FFF9F9] text-black hover:bg-[#7B1984] hover:text-white" value="edit">
                            Edit
                        </option>
                        <option className=" bg-[#FFF9F9] text-black hover:bg-[#7B1984] hover:text-white" value="delete">
                            Delete
                        </option>
                    </select>
                </div>
            </div>

            <div className="mt-auto flex justify-between">
                <p className="text-sm text-gray-500">{task.category}</p>
                <p className="text-sm text-gray-500 ">{formatDate(task.dueDate)}</p>
            </div>
        </div>
    ));

};