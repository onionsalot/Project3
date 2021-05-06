import { useState } from "react";
import * as usersService from "../../../utilities/users-service";
import ItemTable from "../../../Components/ItemTable/ItemTable";
import { Link } from "react-router-dom";
import plusIcon from "../../../pictures/plus.png";
import AdminMenu from "../../../Components/AdminMenu/AdminMenu";
import './CategoryPage.css'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import * as categoriesAPI from '../../../utilities/categories-api'
import deleteIcon from '../../../pictures/delete.png'


export default function CategoryPage({ showCategories, handleDeleteCategory, handleAddCategory }) {
    const [show, setShow] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: "",
    });

    async function handleSubmit(e) {
        e.preventDefault();
        const cat = await categoriesAPI.create(newCategory)
        setNewCategory({
            name: "",
        })
        console.log(cat)
        handleAddCategory(cat)
      }
      function handleChange(e) {
        // console.log(`${[e.target.name]}: ${e.target.value}`)
        setNewCategory({...newCategory, [e.target.name]: e.target.value})
      }

  const handleClose = () => setShow(false);


  function handleShow() {
    setShow(true);
  }
    const items = showCategories.map((category) => (
    <tr>
        <td>{category._id}</td>
      <td>{category.name}</td>
      <td>
      <button className="icon" onClick={() => handleDeleteCategory(category._id)}><img src={deleteIcon} alt="Edit" /></button>
          
      </td>
    </tr>
  ));

  return (
    <main className="CategoryPage">
      <aside>
        <AdminMenu />
      </aside>
      <div>
        <h1>Categories</h1>
        <table>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>ACTION</th>
          </tr>

          {items}
        </table>


      </div>
      <Button variant="primary" onClick={() => handleShow()}>
        Add New Item
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form autoComplete="off" onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={newCategory.name}
          onChange={handleChange}
          required
        />
          <button type="submit" onClick={handleClose}>
              ADD ITEM
            </button>
            
        </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}
