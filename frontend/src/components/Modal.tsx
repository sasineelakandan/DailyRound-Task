import { useState } from "react";
import { FaBold, FaItalic, FaListOl, FaListUl, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Modal({ modalValue, addTaskValue }: any) {
    const storedUserId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const [taskName, setTaskName] = useState('');
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('');
    const [errors, setErrors] = useState<any>({});

    const maxLength = 3000;

    const closeModal = () => {
        setTaskName('');
        setText('');
        setFile(null);
        setCategory('');
        setDate('');
        setStatus('');
        setErrors({});
        modalValue(false);
    };

    const validateFields = () => {
        const newErrors: any = {};
        if (!taskName.trim()) newErrors.taskName = "Task title is required";
        if (!text.trim()) newErrors.text = "Description is required";
        if (!category) newErrors.category = "Category is required";
        if (!date) newErrors.date = "Date is required";
        if (!status) newErrors.status = "Status is required";
        if (!storedUserId) newErrors.user = "User ID not found";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateFields()) return;

        const newTask = { taskName, text, date, status, category, storedUserId, file };
        console.log(newTask);
        addTaskValue(newTask);

        closeModal();
        navigate('/');
    };

    return (
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
                    {/* Task Title */}
                    <input
                        type="text"
                        onChange={(e) => setTaskName(e.target.value)}
                        placeholder="Task Title"
                        className="w-full border rounded p-2 mb-1 bg-gray-200"
                    />
                    {errors.taskName && <p className="text-red-500 text-sm">{errors.taskName}</p>}

                    {/* Description */}
                    <div className="relative w-full border rounded p-2 h-40 mb-2">
                        <textarea
                            placeholder="Description"
                            className="w-full h-full p-2 resize-none focus:outline-none"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
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
                        {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text}</p>}
                    </div>

                    {/* Category, Date, Status */}
                    <div className="flex flex-wrap justify-between mb-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-500">Task Category*</span>
                            <div className="flex items-start gap-1">
                                {['High', 'Medium', 'Low'].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={`px-4 py-1 border rounded-full ${category === cat
                                            ? "bg-[#7B1984] text-white"
                                            : "bg-transparent text-black"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-500">Due on*</span>
                            <input
                                onChange={(e) => setDate(e.target.value)}
                                type="date"
                                className="border rounded p-1"
                            />
                            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-700">Task Status*</span>
                            <select
                                onChange={(e) => setStatus(e.target.value)}
                                className="border rounded p-1 text-gray-700"
                                value={status}
                            >
                                <option value="" disabled>
                                    Choose
                                </option>
                                <option value="todo">Todo</option>
                                <option value="inprogress">In-Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                            {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                        </div>
                    </div>

                    {/* Attachment */}
                    <div className="flex flex-col gap-2">
                        <span className="text-sm text-gray-700">Attachment</span>
                        <div
                            className="w-full h-10 border-2 border-gray-500 bg-gray-100 flex items-center justify-center cursor-pointer"
                            onClick={() => document.getElementById("fileInput")?.click()}
                        >
                            <input
                                type="file"
                                id="fileInput"
                                className="hidden"
                                onChange={(e: any) => setFile(e.target.files[0])}
                            />
                            <span className="text-gray-500">
                                Drop your files here or upload
                            </span>
                        </div>
                    </div>

                    {/* Buttons */}
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
    );
}

export default Modal;
