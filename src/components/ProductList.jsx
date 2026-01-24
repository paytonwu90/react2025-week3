import { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import axios from 'axios';
import ProductModal from './ProductModal';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
};

function ProductList() {
  const [products, setProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [tempProduct, setTempProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState(""); // "create", "edit", "delete"
  const modalRef = useRef(null);
  const bsModalRef = useRef(null);

  useEffect(() => {
    bsModalRef.current = new Modal(modalRef.current);

    modalRef.current.addEventListener('hidden.bs.modal', () => {
      setTempProduct(INITIAL_TEMPLATE_DATA);

      // Bootstrap Modal 關閉時不會主動處理焦點
      // 在 React 專案中，Modal 內的元素可能立刻被卸載
      // 如果焦點還留在裡面，會造成無障礙錯誤
      // 所以在 hide.bs.modal 時手動 blur() 是必要的防護措施
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await getProducts();
        setIsProductsLoading(false);
      } catch (error) {
        console.error('獲取產品失敗:', error);
      }
    })();
  }, []);

  async function getProducts() {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
    }
  }

  function openModal() {
    bsModalRef.current.show();
  }

  function closeModal() {
    bsModalRef.current.hide();
  }

  function handleCreateProduct() {
    setTempProduct(INITIAL_TEMPLATE_DATA);
    setModalType("create");
    openModal();
  }
  
  function handleEditProduct(product) {
    setTempProduct(product);
    setModalType("edit");
    openModal();
  }

  function handleDeleteProduct(product) {
    setTempProduct(product);
    setModalType("delete");
    openModal();
  }

  // Modal 內的事件開始
  function handleModalInputChange(e) {
    const { name, value, type } = e.target;
    setTempProduct({
      ...tempProduct,
      [name]: type === 'checkbox' ? e.target.checked :
              type === 'number' ? Number(value) : value,
    });
  }

  function handleModalSubImageChange(index, value) {
    const newImagesUrl = [...tempProduct.imagesUrl];
    newImagesUrl[index] = value;
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImagesUrl,
    });
  }

  function handleAddSubImage() {
    if (tempProduct.imagesUrl && tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1] === "") {
      return;
    }
    const newImagesUrl = tempProduct.imagesUrl ? [...tempProduct.imagesUrl] : [];
    newImagesUrl.push("");
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImagesUrl,
    });
  }

  function handleDeleteSubImage(index) {
    const newImagesUrl = [...tempProduct.imagesUrl];
    newImagesUrl.splice(index, 1);
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImagesUrl,
    });
  }

  async function handleModalSave() {
    // 清空 tempProduct.imagesUrl 裡的空字串
    const newImagesUrl = tempProduct.imagesUrl?.filter((url) => url !== "") || [];
    const savingProduct = {
      ...tempProduct,
      imagesUrl: newImagesUrl,
    };
    const savingData = {
      data: savingProduct
    }
    
    if (modalType === "create") {
      await createProduct(savingData);
    } else if (modalType === "edit") {
      await updateProduct(savingProduct.id, savingData);
    }

    setTempProduct(INITIAL_TEMPLATE_DATA);
    setModalType("");
    await getProducts();
    closeModal();
  }

  async function createProduct(data) {
    try {
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/admin/product`, data);
    } catch (error) {
      console.error(error);
      error.response && console.log(error.response.data);
    }
  }

  async function updateProduct(id, data) {
    try {
      const response = await axios.put(`${API_BASE}/api/${API_PATH}/admin/product/${id}`, data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteConfirm() {
    await deleteProduct(tempProduct.id);
    await getProducts();
    closeModal();
    setTempProduct(INITIAL_TEMPLATE_DATA);
    setModalType("");
  }

  async function deleteProduct(id) {
    try {
      const response = await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
    } catch (error) {
      console.error(error);
    }
  }
  // Modal 內的事件結束

  return (
    <>
      <div className="container">
        <div className="row mt-5">
          <div className="col-12">
            <h2>產品列表</h2>
            <div className="text-end mb-4">
              <button type="button" className="btn btn-primary" onClick={handleCreateProduct}>建立新的產品</button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th width="120">分類</th>
                  <th>產品名稱</th>
                  <th width="120">原價</th>
                  <th width="120">售價</th>
                  <th width="100">是否啟用</th>
                  <th width="120">編輯</th>
                </tr>
              </thead>
              <tbody>
                {isProductsLoading ? (
                  <tr>
                    <td colSpan="5">載入中...</td>
                  </tr>
                ) : products && products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.category}</td>
                      <td>{product.title}</td>
                      <td className="text-end">{product.origin_price}</td>
                      <td className="text-end">{product.price}</td>
                      <td>{product.is_enabled ?
                        <span className="text-success">啟用</span> :
                        <span>未啟用</span>
                      }</td>
                      <td>
                        <div className="btn-group">
                          <button type="button" className="btn btn-outline-primary btn-sm"
                            onClick={() => handleEditProduct(product)}>
                            編輯
                          </button>
                          <button type="button" className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteProduct(product)}>
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">尚無產品資料</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ProductModal ref={modalRef}
        type={modalType}
        product={tempProduct}
        onChange={handleModalInputChange}
        onSubImageChange={handleModalSubImageChange}
        onAddSubImage={handleAddSubImage}
        onDeleteSubImage={handleDeleteSubImage}
        onSave={handleModalSave}
        onDeleteConfirm={handleDeleteConfirm}
       />
    </>
  );
}

export default ProductList;