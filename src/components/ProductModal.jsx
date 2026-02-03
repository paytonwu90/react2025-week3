import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const modalConfig = {
  create: {
    title: '新增產品',
    size: 'modal-xl',
    headerBg: 'bg-dark',
    content: CreateAndEditContent,
  },
  edit: {
    title: '編輯產品',
    size: 'modal-xl',
    headerBg: 'bg-dark',
    content: CreateAndEditContent,
  },
  delete: {
    title: '刪除產品',
    size: '',
    headerBg: 'bg-danger',
    content: DeleteConfirmationContent,
  },
}

function ProductModal({ ref, type, currentProduct, ...props }) {
  const [product, setProduct] = useState({...currentProduct});

  useEffect(() => {
    setProduct(currentProduct);
  }, [currentProduct]);

  function handleInputChange(e) {
    const { name, value, type } = e.target;
    setProduct({
      ...product,
      [name]: type === 'checkbox' ? e.target.checked :
              type === 'number' ? Number(value) : value,
    });
  }

  async function handleMainImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
	    formData.append("file-to-upload", file);

      const response = await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`, formData);
      e.target.value = '';

      setProduct({
        ...product,
        imageUrl: response.data.imageUrl,
      });
    } catch (error) {
      console.error("上傳圖片失敗:", error);
    }
  }

  function handleSubImageChange(index, value) {
    const newImagesUrl = [...product.imagesUrl];
    newImagesUrl[index] = value;
    setProduct({
      ...product,
      imagesUrl: newImagesUrl,
    });
  }

  function handleAddSubImage() {
    if (product.imagesUrl && product.imagesUrl[product.imagesUrl.length - 1] === "") {
      return;
    }
    const newImagesUrl = product.imagesUrl ? [...product.imagesUrl] : [];
    newImagesUrl.push("");
    setProduct({
      ...product,
      imagesUrl: newImagesUrl,
    });
  }

  function handleDeleteSubImage(index) {
    const newImagesUrl = [...product.imagesUrl];
    newImagesUrl.splice(index, 1);
    setProduct({
      ...product,
      imagesUrl: newImagesUrl,
    });
  }

  if (!type) type = "create"; // 因 type 初始值為空字串，所以在參數解構時給予預設值沒有用
  const { title, size, headerBg, content: Content } = modalConfig[type];
  return (
    <div
      ref={ref}
      id="productModal"
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
      >
      <div className={`modal-dialog ${size}`}>
        <div className="modal-content border-0">
          <div className={`modal-header ${headerBg} text-white`}>
            <h5 id="productModalLabel" className="modal-title">
              <span>{title}</span>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              data-bs-theme="dark"
              aria-label="Close"
              ></button>
          </div>
          <Content {...props}
            product={product}
            onInputChange={handleInputChange}
            onMainImageUpload={handleMainImageUpload}
            onSubImageChange={handleSubImageChange}
            onAddSubImage={handleAddSubImage}
            onDeleteSubImage={handleDeleteSubImage}
          />
        </div>
      </div>
    </div>
  )
}

function CreateAndEditContent({product, onInputChange, onMainImageUpload,
    onSubImageChange, onAddSubImage, onDeleteSubImage, onSave}) {
  return (
    <>
      <div className="modal-body">
        <div className="row">
          <div className="col-sm-4">
            <div className="mainImage mb-5">
              <div className="mb-3">
                <label htmlFor="fileUpload" className="form-label">上傳圖片</label>
                <input 
                  type="file" 
                  className="form-control" 
                  name="fileUpload" 
                  id="fileUpload"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={onMainImageUpload}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="imageUrl" className="form-label w-100 text-start">
                  輸入圖片網址
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  className="form-control"
                  placeholder="請輸入圖片連結"
                  value={product.imageUrl}
                  onChange={onInputChange}
                  />
              </div>
              {product?.imageUrl && (
                <img className="img-fluid" src={product.imageUrl} alt="主圖" />
              )}
            </div>
            <div className="subImages">
              {product?.imagesUrl && product.imagesUrl.length > 0 && (
                product.imagesUrl.map((url, index) => (
                  <div key={index} className="subImage mb-5">
                    <div className="mb-3">
                      <div className="d-flex align-items-end justify-content-between gap-2 mb-2">
                        <label htmlFor={`subImage${index}`} className="form-label mb-0">
                          輸入圖片網址
                        </label>
                        <button type="button" className="btn btn-outline-danger btn-sm"
                          onClick={() => onDeleteSubImage(index)}>
                          刪除圖片
                        </button>
                      </div>
                      <input
                        type="text"
                        id={`subImage${index}`}
                        name={`subImage${index}`}
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        value={url}
                        onChange={(e) => onSubImageChange(index, e.target.value)}
                        />
                    </div>
                    {url && (
                      <img className="img-fluid" src={url} alt={`副圖 ${index + 1}`} />
                    )}
                  </div>
                ))
              )}
            </div>
            <div>
              <button className="btn btn-outline-primary btn-sm d-block w-100"
                onClick={onAddSubImage}>
                新增圖片
              </button>
            </div>
          </div>
          <div className="col-sm-8">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">標題</label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-control"
                placeholder="請輸入標題"
                value={product.title}
                onChange={onInputChange}
                />
            </div>

            <div className="row">
              <div className="mb-3 col-md-6">
                <label htmlFor="category" className="form-label">分類</label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  className="form-control"
                  placeholder="請輸入分類"
                  value={product.category}
                  onChange={onInputChange}
                  />
              </div>
              <div className="mb-3 col-md-6">
                <label htmlFor="unit" className="form-label">單位</label>
                <input
                  id="unit"
                  name="unit"
                  type="text"
                  className="form-control"
                  placeholder="請輸入單位"
                  value={product.unit}
                  onChange={onInputChange}
                  />
              </div>
            </div>

            <div className="row">
              <div className="mb-3 col-md-6">
                <label htmlFor="origin_price" className="form-label">原價</label>
                <input
                  id="origin_price"
                  name="origin_price"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="請輸入原價"
                  value={product.origin_price}
                  onChange={onInputChange}
                  />
              </div>
              <div className="mb-3 col-md-6">
                <label htmlFor="price" className="form-label">售價</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="請輸入售價"
                  value={product.price}
                  onChange={onInputChange}
                  />
              </div>
            </div>
            <hr />

            <div className="mb-3">
              <label htmlFor="description" className="form-label">產品描述</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                placeholder="請輸入產品描述"
                value={product.description}
                onChange={onInputChange}
                ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="form-label">說明內容</label>
              <textarea
                id="content"
                name="content"
                className="form-control"
                placeholder="請輸入說明內容"
                value={product.content}
                onChange={onInputChange}
                ></textarea>
            </div>
            <div className="d-flex justify-content-center mb-3">
              <div className="form-check">
                <input
                  id="is_enabled"
                  name="is_enabled"
                  type="checkbox"
                  className="form-check-input"
                  checked={product.is_enabled}
                  onChange={onInputChange}
                  />
                <label className="form-check-label" htmlFor="is_enabled">
                  是否啟用
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-outline-secondary"
          data-bs-dismiss="modal"
          >
          取消
        </button>
        <button type="button" className="btn btn-primary" onClick={() => onSave(product)}>確認</button>
      </div>
    </>
  )
}

function DeleteConfirmationContent({product, onDeleteConfirm}) {
  return (
    <>
      <div className="modal-body">
        <p className="fs-4">
          確定要刪除
          <span className="text-danger">{product.title}</span>嗎？
        </p>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-outline-secondary"
          data-bs-dismiss="modal"
          >
          取消
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {onDeleteConfirm()}}
        >
          刪除
        </button>
      </div>
    </>
  );
}

export default ProductModal;