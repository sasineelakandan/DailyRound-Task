
import { useState } from "react";
import { FaBold, FaItalic, FaListOl, FaListUl, FaTimes, } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
function Modal({ modalValue, addTaskValue }: any) {
    const storedUserId = localStorage.getItem('userId');

    const navigate = useNavigate();
    const [taskName, setTaskName] = useState('')
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('');
    const maxLength = 3000;
    const closeModal = () => {
        setTaskName('')
        setText('')
        setFile(null)
        setCategory('')
        setDate('')
        setStatus('')
        modalValue(false);
    };
    const handleChange = (event: any) => {
        if (event.target.value.length <= maxLength) {
            setText(event.target.value);
        }
    };
    const handleCategory = (event: any) => {
        setCategory(event.target.value);
    }

    const handleTaskName = (event: any) => {
        if (event.target.value.length <= maxLength) {
            setTaskName(event.target.value);
        }
    };
    const handleStatus = (event: any) => {
        setStatus(event.target.value);
    };
    const handleDate = (event: any) => {
        setDate(event.target.value)
    }
    const handleFileUpload = (e: any) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
        }
    };
    const handleSubmit = () => {
        (async () => {
            if (!taskName || !text || !date || !status || !category || !storedUserId) {
                alert("Please fill in all the required fields.");
                return;
            }
            const newTask = { taskName, text, date, status, category, storedUserId, file };
            addTaskValue(newTask); 
            setTaskName('')
            setText('')
            setFile(null)
            setCategory('')
            setDate('')
            setStatus('')
            modalValue(false);
            navigate('/')
        })()
    }


    return (
        <>
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
                    <div className="flex justify-between">
                        <h2 className="text-xl font-bold">Create Task</h2>
                        <button onClick={closeModal} className="text-gray-600">
                            <FaTimes className="text-2xl" />
                        </button>
                    </div>
                    <div className="border-b border-gray-300 w-full my-2"></div>
                    <div className="mt-4">
                        <input
                            type="text"
                            onChange={handleTaskName}
                            placeholder="Task Title"
                            className="w-full border rounded p-2 mb-2 bg-gray-200"
                        />
                        <div className="relative w-full border rounded p-2 h-40 mb-2">
                            <textarea
                                placeholder="Description"
                                className="w-full h-full p-2 resize-none focus:outline-none "
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
                                    <option value="" disabled selected>
                                        Choose
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

                        <div className="flex justify-end gap-4 mt-4">
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
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal
