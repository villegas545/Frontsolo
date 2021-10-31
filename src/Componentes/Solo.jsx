import React from 'react'
import axios from 'axios'
import shortid from 'shortid';
function Solo() {
    //ESTADOS
    const [title, setTitle] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [completed, setCompleted] = React.useState("")
    const [todos, setTodos] = React.useState([])
    const [error, setError] = React.useState(null)
    const [modoEdicion, setModoEdicion] = React.useState(false)
    const [id, setId] = React.useState('')
    //CONSTANTES
    const url = 'http://localhost:3001/api/todos'
    //PARA QUE LA PAGINA AL CARGAR, CARGUE EL CRUD
    React.useEffect(() => {
        actualizarRegistros();
    }, [])

    //ACTUALIZAR LAS REGISTROS
    const actualizarRegistros = async () => {
        let lasTareas = await axios.get(url);
        setTodos(lasTareas.data);
    }

    //CAMBIAR ESTADO
    const editar = (item) => {
        setModoEdicion(true)
        setTitle(item.title);
        setDescription(item.description);
        setCompleted(item.completed);
        setId(item.id)
    }

    //FUNCION PARA AGREGAR REGISTROS
    const agregarRegistro = async e => {
        e.preventDefault()
        try {
            let enviar = {
                id: shortid.generate(),
                title,
                description,
                completed
            }
            await axios.post(url, { ...enviar });
            console.log("success");
            setTitle("");
            setDescription("");
            setCompleted("");
            actualizarRegistros();
            setError(false);
        } catch (error) {
            console.log(error.message);
        }
    }

    //FUNCION PARA ELIMINAR LOS REGISTROS
    const eliminarRegistro = async (id) => {
        try {
            await axios.delete(`${url}/${id}`);
            console.log("success");
            actualizarRegistros();
        } catch (error) {
            console.log(error.message);
        }

    }

    //FUCION PARA EDITAR LOS REGISTROS
    const editarRegistro = async (e) => {
        e.preventDefault()
        try {
            let enviar = {
                title,
                description,
                completed
            }
            await axios.put(`${url}/${id}`, { ...enviar });
            actualizarRegistros();
            setTitle("");
            setDescription("");
            setCompleted("");
            setModoEdicion(false);
            setError(false);
        } catch (error) {
            console.log(error.message);
        }

    }


    return (
        <div className="container mt-5">
            <h1 className="text-center">Solo trucking</h1>
            <hr />
            <div className="row">
                <div className="col-8">
                    <h4 className="text-center">Lista de registros</h4>

                    {

                        todos.length === 0 ? (
                            <ul className="list-group">
                                <li className="list-group-item">No hay registros</li>
                            </ul>
                        ) : (
                            <div>
                                <table className="table table-dark">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Completed</th>
                                            <th>Update</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {todos.map(item => (
                                            <tr>
                                                <td>{item.id}</td>
                                                <td>{item.title}</td>
                                                <td>{item.description}</td>
                                                <td>{item.completed ? 'True' : 'False'}</td>
                                                <td> <button
                                                    className="btn btn-warning btn-sm float-right"
                                                    onClick={() => editar(item)}
                                                >
                                                    Editar
                                                </button></td>
                                                <td> <button
                                                    className="btn btn-danger btn-sm float-right mx-2"
                                                    onClick={() => eliminarRegistro(item.id)}
                                                >
                                                    Eliminar
                                                </button></td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>
                                </table>
                            </div>

                        )

                    }



                </div>
                <div className="col-4">
                    <h4 className="text-center">
                        {
                            modoEdicion ? 'Editar Registro' : 'Agregar Registro'
                        }
                    </h4>
                    <form onSubmit={modoEdicion ? editarRegistro : agregarRegistro}>

                        {
                            error ? <span className="text-danger">{error}</span> : null
                        }
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Title"
                            onChange={e => setTitle(e.target.value)}
                            value={title}
                        />
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Description"
                            onChange={e => setDescription(e.target.value)}
                            value={description}
                        />
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Completed"
                            onChange={e => setCompleted(e.target.value)}
                            value={completed}
                        />
                        {
                            modoEdicion ? (
                                <button className="btn btn-warning btn-block" type="submit">Editar</button>
                            ) : (
                                <button className="btn btn-dark btn-block" type="submit">Agregar</button>
                            )
                        }

                    </form>
                </div>
            </div>
        </div>
    )
}
export default Solo
