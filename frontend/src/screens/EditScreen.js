import React from 'react'
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGetSpecificStoryMutation } from '../slices/storiesApiSlice';
import { useUpdateStoryMutation } from '../slices/storiesApiSlice';
import Loader from '../components/Loader';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



const EditScreen = () => {
        const { id } = useParams();

        const [title, setTitle] = useState("");
        const [status, setStatus] = useState("public");
        const [body, setBody] = useState("")

        const [getSpecificStory, {isLoading1}] = useGetSpecificStoryMutation();
        const [updateStory, {isLoading2}] = useUpdateStoryMutation();

        const navigate = useNavigate();


        useEffect(() => {

                const fetchData = async () =>{
                        try {
                                const res = await getSpecificStory({ id }).unwrap();
                                setTitle(res.stories.title)
                                setStatus(res.stories.status)
                                setBody(res.stories.body)
                              } catch (error) {
                                toast.error(error?.data?.message || error.error);
                              }
                }

                fetchData();
              }, []);



        const handleSubmit = async (event) => {
                event.preventDefault();
                
                try {
                        const res = await updateStory({
                        title,
                        status,
                        body,
                        id
                        }).unwrap();
                        navigate('/dashboard')
                        toast.success("Story Updated");
                } catch (error) {
                        toast.error(error?.data?.message || error.error);
                }
        };

        if(isLoading1){
                return <Loader />
        }

  return (
        <div>
        <h3>Edit Story</h3>
        <div className="row">
          <form onSubmit={handleSubmit} className="col s12">
            <div className="row">
              <div className="input-field">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="title">Title</label>
              </div>
            </div>
  
            <div className="row">
              <div className="input-field">
                <select
                  id="status"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
                <label htmlFor="status">Status</label>
              </div>
            </div>
  
            <div className="row">
              <div className="input-field">
                <h5>Tell Us Your Story:</h5>
                <textarea
                  id="body"
                  name="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                ></textarea>
              </div>
            </div>
  
            <div className="row">
              <button type="submit" className="btn">
                Save
              </button>
              <a href="/dashboard" className="btn orange">
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
  )
}

export default EditScreen