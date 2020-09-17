import React, {useEffect, useState} from 'react';
import './App.scss';
import Form from 'react-bootstrap/Form';
import api from "./services/api";
import {ToastContainer, toast} from 'react-toastify';

function App() {
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState('');
    const [loadImage, setLoadImage] = useState(false);
    const [emptyImage, setEmptyImage] = useState(true);

    const errorPage = (errorStatus) => toast.error(errorStatus, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const pageSuccess = (successStatus) => toast.success(successStatus, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });


    function sendFile() {
        let formData = new FormData();
        const imagem = document.getElementById("image");

        if (!imagem || !imagem.files.length > 0) {
            return null;
        }
        setLoadImage(true)

        setEmptyImage(false)

        formData.set('file', imagem.files[0]);

        api.post('upload', formData).then(success => {
            const {urlKey} = success.data
            if (urlKey) {
                sendConfig(urlKey);
            }
            setLoadImage(false)
        }).catch(error => {
            errorPage('Error no upload')
            setLoadImage(false)
        })
    }

    function sendConfig(urlKey) {
        if (!description || !description) {
            return null;
        }
        setLoadImage(true)

        api.post('images', {
            url: urlKey,
            description: description
        }).then(success => {
            getAllImages()
            pageSuccess('Imagem adicionada')
            setLoadImage(false)
            resetForm();
        }).catch(error => {
            errorPage('Error no upload IMG')
            setLoadImage(false)
        })

    }

    function resetForm() {
        setDescription('');
        document.getElementById("image").value = null;
    }

    function getAllImages() {
        api.get('images').then(success => {
            setImages(success.data)
        }).catch(error => {
            errorPage('Error ao carregar imagens')
        })
    }

    function removerImage(id) {
        api.delete(`images/${id}`).then(success => {
            getAllImages()
            pageSuccess('Imagem removida')
        }).catch(error => {
            errorPage('Error ao remover')
        })
    }

    useEffect(() => {
        getAllImages()
    }, [])

    function renderImages() {
        return <div className="row mt-3">
            {
                images && images.length > 0 ? images.map((image, index) => {
                    return <div className="col-4 mt-2" key={index}>
                        <div className="card p-1">
                            <img className="card-img-top" src={image.url} alt="Card image cap"/>
                            <div className="card-body px-0">
                                <div className="d-flex justify-content-center">
                                    <h5 className="card-title">{image.description}</h5>
                                </div>
                                <div className="d-flex w-100 justify-content-center">
                                    <button
                                        type="button"
                                        disabled={loadImage}
                                        className="btn btn-danger w-75"
                                        onClick={() => removerImage(image._id)}>
                                        Remover
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                }) : <div className="col-12">
                    <div className="card">
                        <div className="p-5 d-flex justify-content-center">
                            <p className="m-0 text-white">Sem Imagens</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    }

    function renderUploadImage() {
        return <div className="row renderUploadImage">
            <div className="col-12">
                <div className="d-flex justify-content-center">
                    <Form className="mt-3">
                        <Form.Group>
                            <Form.Control className="description" type="text" value={description} onChange={event => {
                                setDescription(event.target.value)
                            }} placeholder="Descrição" id="description"/>
                        </Form.Group>
                        <Form.Group>
                            <Form.File
                                id="image"
                                className="upload"
                                onChange={() => {
                                    setEmptyImage(false)
                                }}
                                accept="image/x-png,image/gif,image/jpeg"
                            />
                        </Form.Group>
                        <div className="w-100">
                            <button type="button"
                                    disabled={loadImage || !description || emptyImage}
                                    className="w-100 btn btn-primary" onClick={sendFile}>
                                {loadImage ? 'Publicando...' : 'Publicar'}
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    }

    return (
        <div className="container App">
            <ToastContainer/>
            {renderUploadImage()}
            {renderImages()}
        </div>
    );
}

export default App;