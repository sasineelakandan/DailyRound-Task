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
    const [file, setFile] = useState<string | null>(null);
    const [editImage, setEditImage] = useState<string | null>(null);
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("");
    // const [history, setHistory] = useState<string | null>(null);
    const [errors, setErrors] = useState<any>({});

    const maxLength = 3000;

    useEffect(() => {
        (async () => {
            const response = await singleUsertask(editValue);
            setTaskName(response.title || "");
            setText(response.description || "");
            setCategory(response.category || "");
            setDate(response.dueDate || "");
            setStatus(response.status || "");
            const attachment = response.attachments?.[0] || null;
            setFile(attachment);
            setEditImage(attachment);
            // setHistory(response.history || "");
        })();
    }, [editValue]);

    const closeModal = () => {
        setTaskName("");
        setText("");
        setFile(null);
        setEditImage(null);
        setCategory("");
        setDate("");
        setStatus("");
        setErrors({});
        modalValue(false);
    };

    const handleFileUpload = async (e: any) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setLoading(true);
            const filePreview = URL.createObjectURL(uploadedFile);
            setFile(filePreview);

            const storage = getStorage();
            const storageRef = ref(storage, `tasks/${Date.now()}_${uploadedFile.name}`);
            const uploadSnapshot = await uploadBytes(storageRef, uploadedFile);
            const fileUrl = await getDownloadURL(uploadSnapshot.ref);
            setEditImage(fileUrl);
            setLoading(false);
        }
    };

    const removeImage = () => {
        setFile(null);
        setEditImage(null);
    };

    const validateForm = () => {
        let valid = true;
        const newErrors: any = {};

        if (!taskName.trim()) {
            newErrors.taskName = "Task name is required.";
            valid = false;
        }
        if (!text.trim()) {
            newErrors.text = "Description is required.";
            valid = false;
        }
        if (!category) {
            newErrors.category = "Category is required.";
            valid = false;
        }
        if (!date) {
            newErrors.date = "Due date is required.";
            valid = false;
        }
        if (!status) {
            newErrors.status = "Status is required.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const editedResponse = await editTasks(
                taskName,
                text,
                date,
                status,
                category,
                storedUserId as string,
                editValue,
                editImage
            );

            const updatedTask = editedResponse?.data;
            if (updatedTask) {
                setTasksValue((prevTasks: Task[]) =>
                    prevTasks.map((task) => task._id === updatedTask._id ? updatedTask : task)
                );
                setOriginalTasks((prevOriginalTasks: Task[]) =>
                    prevOriginalTasks.map((task) => task._id === updatedTask._id ? updatedTask : task)
                );
            }
        } catch (error) {
            console.error("Error while editing the task:", error);
        } finally {
            modalValue(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-4xl flex flex-col gap-6 relative overflow-y-auto max-h-[90vh]">
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-600 hover:text-red-500">
                    <FaTimes className="text-2xl" />
                </button>

                <input
                    type="text"
                    onChange={(e) => setTaskName(e.target.value)}
                    value={taskName}
                    placeholder="Task Title*"
                    className={`w-full border rounded p-2 mb-1 ${errors.taskName && "border-red-500"}`}
                />
                {errors.taskName && <span className="text-red-500 text-sm">{errors.taskName}</span>}

                <div className="relative w-full border rounded p-2 h-40 mb-1">
                    <textarea
                        placeholder="Description*"
                        className="w-full h-full p-2 resize-none focus:outline-none"
                        value={text}
                        onChange={(e) => {
                            if (e.target.value.length <= maxLength) setText(e.target.value);
                        }}
                    />
                    <div className="absolute bottom-2 left-2 flex gap-4 text-gray-500">
                        <FaBold />
                        <FaItalic />
                        <FaListOl />
                        <FaListUl />
                    </div>
                    <span className="absolute bottom-2 right-2 text-gray-500 text-sm">
                        {text.length}/{maxLength}
                    </span>
                </div>
                {errors.text && <span className="text-red-500 text-sm">{errors.text}</span>}

                <div className="flex flex-wrap justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-500">Task Category*</span>
                        <div className="flex gap-2">
                            {["High", "Medium", "Low"].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setCategory(item)}
                                    className={`px-4 py-1 border rounded-full ${
                                        category === item ? "bg-[#7B1984] text-white" : "bg-transparent text-black"
                                    }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                        {errors.category && <span className="text-red-500 text-sm">{errors.category}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-500">Due on*</span>
                        <input
                            type="date"
                            value={date?.split("T")[0] || ""}
                            onChange={(e) => setDate(e.target.value)}
                            className={`border rounded p-1 ${errors.date && "border-red-500"}`}
                        />
                        {errors.date && <span className="text-red-500 text-sm">{errors.date}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-700">Task Status*</span>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className={`border rounded p-1 text-gray-700 ${errors.status && "border-red-500"}`}
                        >
                            <option value="">Select</option>
                            <option value="todo">Todo</option>
                            <option value="inprogress">In-Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        {errors.status && <span className="text-red-500 text-sm">{errors.status}</span>}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-sm text-gray-700">Attachment</span>
                    <div
                        className="w-full h-10 border-2 border-gray-400 bg-gray-100 flex items-center justify-center cursor-pointer"
                        onClick={() => document.getElementById("fileInput")?.click()}
                    >
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                        <span className="text-gray-500">Drop your files here or upload</span>
                    </div>
                </div>

                {file && (
                    <div className="relative w-1/4 mt-2">
                        {loading ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-gray-500">Loading...</span>
                            </div>
                        ) : (
                            <>
                                <img src={file} alt="Preview" className="w-full rounded-lg" />
                                <button
                                    onClick={removeImage}
                                    className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
                                >
                                    <FaTimes className="text-red-500" />
                                </button>
                            </>
                        )}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    className="mt-6 px-6 py-2 bg-[#7B1984] text-white rounded hover:bg-[#5e1067] transition"
                >
                    Update Task
                </button>
            </div>
        </div>
    );
}

export default EditModal;
