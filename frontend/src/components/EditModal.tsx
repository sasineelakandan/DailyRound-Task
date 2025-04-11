import { useEffect, useState } from "react";
import { FaBold, FaItalic, FaListOl, FaListUl, FaTimes } from "react-icons/fa";
import { editTasks, singleUsertask } from "../services/taskService";
import { Task } from "../types";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


function EditModal({ modalValue, editValue, setTasksValue, setOriginalTasks }: any) {
    const [loading, setLoading] = useState(false);

    const storedUserId = localStorage.getItem("userId");
    const [taskName, setTaskName] = useState("");
    const [text, setText] = useState("");
    const [file, setFile] = useState<string | null>(null); // Update the type to allow a string or null
    const [history, setHistory] = useState<string | null>(null); // Update the type to allow a string or null
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("");
    const [_tasks, setTasks] = useState<Task | null>(null);
    const [editImage, setEditImage] = useState<string | null>(null); // Update the type to allow a string or null


    useEffect(() => {
        (async () => {
            const response = await singleUsertask(editValue);
            setHistory(response.history);
        })();
    }, [editValue]);

    const formatDate = (dateStr: string) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
        // Split the input string to extract date and time
        const [datePart, timePart] = dateStr.split(', ');
        const [day, month, year] = datePart.split('/').map(num => parseInt(num, 10));
        const [hour, minute, second] = timePart.split(':').map(num => parseInt(num, 10));
      
        // Create a date object with the correct values
        const date = new Date(year, month - 1, day, hour, minute, second);
      
        // Check if the date is valid
        if (isNaN(date.getTime())) {
          return 'Invalid date';
        }
      
        const monthName = months[date.getMonth()];
        const dayOfMonth = date.getDate();
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        
        hours = hours % 12 || 12; // Convert 24hr to 12hr format
      
        return `${monthName} ${dayOfMonth} at ${hours}:${minutes}${ampm}`;
    };
    const maxLength = 3000;


    const closeModal = () => {
        setTaskName("");
        setText("");
        setFile(null);
        setEditImage(null)
        setCategory("");
        setDate("");
        setStatus("");
        modalValue(false);
    };
    const removeImage = () => {
        setFile(null);
    };

    const handleChange = (event: any) => {
        if (event.target.value.length <= maxLength) {
            setText(event.target.value);
        }
    };

    const handleCategory = (event: any) => {
        setCategory(event.target.value);
    };

    const handleTaskName = (event: any) => {
        if (event.target.value.length <= maxLength) {
            setTaskName(event.target.value);
        }
    };

    const handleStatus = (event: any) => {
        setStatus(event.target.value);
    };

    const handleDate = (event: any) => {
        setDate(event.target.value);
    };

    const handleFileUpload = (e: any) => {
        (async () => {
            const uploadedFile = e.target.files[0];
            if (uploadedFile) {
                setLoading(true); // Set loading to true when file upload starts
                const filePreview = URL.createObjectURL(uploadedFile);
                setFile(filePreview);
                const storage = getStorage();
                const storageRef = ref(storage, `tasks/${Date.now()}_${uploadedFile.name}`);
                const uploadSnapshot = await uploadBytes(storageRef, uploadedFile);
                const fileUrl = await getDownloadURL(uploadSnapshot.ref);
                setEditImage(fileUrl);
                setLoading(false); // Set loading to false once file URL is received
            }
        })();
    };


    const handleSubmit = () => {
        (async () => {
            if (!taskName || !text || !date || !status || !category || !storedUserId) {
                alert("Please fill in all the required fields.");
                return;
            }

            try {


                const editedResponse = await editTasks(
                    taskName,
                    text,
                    date,
                    status,
                    category,
                    storedUserId,
                    editValue, editImage
                );

                const updatedTask = editedResponse?.data;

                if (updatedTask) {

                    setTasksValue((prevTasks: Task[]) =>
                        prevTasks.map(task => task._id === updatedTask._id ? updatedTask : task)
                    );

                    setOriginalTasks((prevOriginalTasks: Task[]) =>
                        prevOriginalTasks.map(task => task._id === updatedTask._id ? updatedTask : task)
                    );
                }
            } catch (error) {
                console.error("Error while editing the task:", error);
            } finally {
                modalValue(false);
            }
        })();
    };


    useEffect(() => {
        (async () => {
            const response = await singleUsertask(editValue)
            setTasks(response)
            setTaskName(response.title);
            setText(response.description);
            setCategory(response.category);
            setDate(response.dueDate);
            setStatus(response.status);
            setFile(response.attachments[0]);
            setHistory(response.history)
        })()
    }, [editValue])


    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-4xl flex gap-6 relative">

                <div className="w-3/4">
                    <div className="flex justify-between">
                        <h2 className="text-xl font-bold"></h2>
                        <button onClick={closeModal} className="text-gray-600 absolute top-4 right-4 ">
                            <FaTimes className="text-2xl" />
                        </button>
                    </div>
                    <div className="border-b border-gray-300 w-full my-2"></div>
                    <div className="mt-4">
                        <input
                            type="text"
                            onChange={handleTaskName}
                            value={taskName}

                            placeholder="Task Title"
                            className="w-full border rounded p-2 mb-2 bg-gray-200"
                        />
                        <div className="relative w-full border rounded p-2 h-40 mb-2">
                            <textarea
                                placeholder="Description"
                                className="w-full h-full  p-2 resize-none focus:outline-none"
                                value={text}
                                onChange={handleChange}
                                maxLength={maxLength}
                            ></textarea>
                            <div className="absolute bottom-2 left-2 flex gap-4 text-gray-500">
                                <FaBold />
                                <FaItalic />
                                <FaListOl />
                                <FaListUl />
                            </div>
                            <span className="absolute bottom-2 right-2 text-gray-500 text-sm">
                                {text.length}/{maxLength} characters
                            </span>
                        </div>

                        <div className="flex flex-wrap justify-between mb-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-500">Task Category*</span>
                                <div className="flex items-start gap-1">
                                    <button
                                        onClick={handleCategory}
                                        value="work"
                                        className={`px-4 py-1 border rounded-full ${category === "work"
                                            ? "bg-[#7B1984] text-white"
                                            : "bg-transparent text-black"
                                            }`}
                                    >
                                        Work
                                    </button>

                                    <button
                                        onClick={handleCategory}
                                        value="personal"

                                        className={`px-4 py-1 border rounded-full ${category === "personal"
                                            ? "bg-[#7B1984] text-white"
                                            : "bg-transparent text-black"
                                            }`}
                                    >
                                        Personal
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-500">Due on*</span>

                                <input
                                    onChange={handleDate}
                                    value={date ? date.toString().split('T')[0] : ''}
                                    type="date"
                                    className="border rounded p-1"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-700">Task Status*</span>
                                <select
                                    onChange={handleStatus}
                                    className="border rounded p-1 text-gray-700"
                                >
                                    <option value={status} disabled selected>
                                        {status}
                                    </option>
                                    <option value="todo">Todo</option>
                                    <option value="inprogress">In-Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-gray-700">Attachment</span>
                            <div
                                className="w-full h-10 border-2 border-gray-500 bg-gray-100 flex items-center justify-center cursor-pointer"
                                onClick={() => {
                                    const fileInput = document.getElementById("fileInput");
                                    if (fileInput) {
                                        fileInput.click();
                                    }
                                }}
                            >
                                <input
                                    type="file"
                                    id="fileInput"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                                <span className="text-gray-500">
                                    Drop your files here or update
                                </span>
                            </div>
                        </div>
                        <div className="relative w-1/4 flex-shrink-0">
                            {loading ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-gray-500">Loading...</span> {/* You can replace this with a spinner */}
                                </div>
                            ) : file ? (
                                <>
                                    <img
                                        src={file} // Replace with your image source
                                        alt="Preview"
                                        className="w-full h-auto rounded-lg"
                                    />
                                    <button
                                        onClick={removeImage}
                                        className="absolute top-1 right-1 bg-gray-100 p-1 rounded-full shadow-md text-gray-600 hover:text-gray-800"
                                    >
                                        <FaTimes className="text-sm" />
                                    </button>
                                </>
                            ) : null}
                        </div>



                        <div className="flex justify-end gap-4 mt-4 absolute bottom-4 right-4 ">
                            <button
                                onClick={closeModal}
                                className="px-6 py-2 text-sm bg-gray-200 rounded-full"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 text-sm text-white rounded-full"
                                style={{ backgroundColor: "#7B1984" }}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-1/4 p-4 rounded-lg overflow-y-auto h-[500px]">
                    <h3 className="text-sm text-gray-500 mb-4">Activity</h3>
                    <ul className="space-y-3">
                        {history ? (
                            (Array.isArray(history) ? history : [history]).map((item, index) => {
                                const parts = item.split(' on '); // Split to separate description and date
                                const description = parts[0];
                                const dateStr = parts[1];
                                const formattedDate = dateStr ? formatDate(dateStr) : '';

                                return (
                                    <li key={index} className="flex justify-between text-sm text-gray-700">
                                        <span>{description}</span>
                                        <span className="text-right text-gray-500">{formattedDate}</span>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="text-sm text-gray-500">No activity yet</li>
                        )}
                    </ul>
                </div>


            </div>
        </div>
    );
}

export default EditModal;
