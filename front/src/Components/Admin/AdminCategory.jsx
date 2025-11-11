import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editId, setEditId] = useState(null);

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:7013/api/admin/getcategory"
      );
      setCategories(res.data.categories);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Add / Update Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `http://localhost:7013/api/admin/updatecategory/${editId}`,
          {
            CategoryName: categoryName,
          }
        );
        setEditId(null);
      } else {
        await axios.post(
          "http://localhost:7013/api/admin/addcategory",
          {
            CategoryName: categoryName,
          }
        );
      }
      setCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Delete Category
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:7013/api/admin/deletecategory/${id}`
      );
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Edit Category
  const handleEdit = (category) => {
    setCategoryName(category.CategoryName);
    setEditId(category._id);
  };

  return (
    <div className=" mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="text-center mb-4" style={{ color: "orangered" }}>
            Manage Categories
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="d-flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="form-control"
            />
            <button
              type="submit"
              className="btn text-white"
              style={{ backgroundColor: "orangered" }}
            >
              {editId ? "Update" : "Add"}
            </button>
          </form>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((cat, index) => (
                    <tr key={cat._id}>
                      <td>{index + 1}</td>
                      <td>{cat.CategoryName}</td>
                      <td className="text-center">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="btn btn-sm btn-outline-primary me-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategory;
