import React from 'react'
import axios from 'axios'
function Solo() {
    const [todo, setTodo] = React.useState('')
    const [todos, setTodos] = React.useState([])
    const [error, setError] = React.useState(null)
    const [modoEdicion, setModoEdicion] = React.useState(false)
    const [id, setId] = React.useState('')
    //PARA QUE LA PAGINA AL CARGAR, CARGUE EL CRUD
    React.useEffect(() => {
        actualizarRegistros();
    }, [])

    //ACTUALIZAR LAS TAREAS
    const actualizarRegistros = async () => {
        let lasTareas = await axios.get(`http://localhost:3002/tarea`);
        setTodos(lasTareas.data);
    }

    //CAMBIAR ESTADO
    const editar = (item) => {
        setModoEdicion(true)
        setTodo(item.nombreTarea);
        setId(item.id)
    }

    //FUNCION PARA AGREGAR TAREA
    const agregarRegistro = async e => {
        e.preventDefault()
        try {
            if (!todo.trim()) {
                setError(true);
                return
            }
            await axios.post(`http://localhost:3002/tarea`, { nombreTarea: todo });
            console.log("success");
            setTodo("");
            actualizarRegistros();
            setError(false);
        } catch (error) {
            console.log(error.message);
        }
    }

    //FUNCION PARA ELIMINAR LA TAREA
    const eliminarRegistro = async (id) => {
        try {
            await axios.delete(`http://localhost:3002/tarea/${id}`);
            console.log("success");
            actualizarRegistros();
        } catch (error) {
            console.log(error.message);
        }

    }

    //FUCION PARA EDITAR LA TAREA
    const editarRegistro = async (e) => {
        e.preventDefault()
        try {
            if (!todo.trim()) {
                setError(true);
                return
            }
            await axios.put(`http://localhost:3002/tarea/${id}`, { nombreTarea: todo });
            actualizarRegistros();
            setTodo("");
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
                    <ul className="list-group">
                        {

                            todos.length === 0 ? (
                                <li className="list-group-item">No hay registros</li>
                            ) : (
                                todos.map(item => (
                                    <li className="list-group-item" key={item.id}>
                                        <span className="lead">{item.nombreTarea}</span>

                                        <button
                                            className="btn btn-danger btn-sm float-right mx-2"
                                            onClick={() => eliminarRegistro(item.id)}
                                        >
                                            Eliminar
                                        </button>

                                        <button
                                            className="btn btn-warning btn-sm float-right"
                                            onClick={() => editar(item)}
                                        >
                                            Editar
                                        </button>

                                    </li>
                                ))
                            )

                        }


                    </ul>
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
                            placeholder="Ingrese Tarea"
                            onChange={e => setTodo(e.target.value)}
                            value={todo}
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
