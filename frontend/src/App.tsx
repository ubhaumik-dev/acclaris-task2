//import axios from "axios";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

interface Note {
  id: number;
  title: string;
  content: string;
}

const App = () => {
  const API = "http://127.0.0.1:8000";
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const createNote = async () => {
    if (!title || !content) return;
    try {
      await axios.post(`${API}/create-notes`, {
        title,
        content,
      });

      setTitle("");
      setContent("");
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API}/get-notes`);
      setNotes(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateNote = async () => {
    if (!editNote) return;
    try {
      await axios.put(`${API}/update-notes`,
        {
          id: editNote.id,
          title: editTitle,
          content: editContent,
        });
      setEditNote(null);
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async()=>{
    console.log(deleteId)
    try{
      await axios.delete(`${API}/delete-note`,{
        data:{
          id: deleteId
        },
      })
      setDeleteId(null)
      fetchNotes();
    }
    catch(error)
    {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <div>
        <div>
          <p>Title</p>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTitle(e.currentTarget.value);
            }}
          />
        </div>
        <div>
          <p>Content</p>
          <input
            type="text"
            placeholder="Content"
            value={content}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setContent(e.currentTarget.value);
            }}
          />
        </div>
      </div>

      <button onClick={createNote}>Create Note</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
          </tr>
        </thead>

        <tbody>
          {notes.map((note) => (
            <tr key={note.id}>
              <td>{note.id}</td>
              <td>{note.title}</td>
              <td>{note.content}</td>
              <td>
                <button
                  onClick={() => {
                    setEditNote(note);
                    setEditTitle(note.title);
                    setEditContent(note.content);
                  }}
                >
                  Edit
                </button>
              </td>
              <td>
                <button onClick={() => {setDeleteId(note.id)}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/*EDIT POPUP */}
      {editNote && (
        <div style={popUpStyle}>
          <div style={popUpBoxStyle}>
            <h2>Edit Note</h2>
            <p>Title</p>
            <input
              type="text"
              value={editTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEditTitle(e.currentTarget.value);
              }}
            />
            <p>Content</p>
            <input
              type="text"
              value={editContent}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEditContent(e.currentTarget.value);
              }}
            />
            <div>
              <button onClick={updateNote}>Update</button>
              <button onClick={()=>{setEditNote(null)}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/*DELETE POPUP */}
      {
        deleteId && (
        <div style={popUpStyle}>
          <div style={popUpBoxStyle}>
            
            <p>Are you sure you want to delete Note {deleteId} ?</p>
           
            <div>
              <button onClick={()=>{setDeleteId(null)}}>Cancel</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )
      }
    </div>
  );
};

const popUpStyle: React.CSSProperties = {
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const popUpBoxStyle: React.CSSProperties = {
  background: "white",
  padding: "20px",
  borderRadius:"10px"
};

export default App;
