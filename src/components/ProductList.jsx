import { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import axios from 'axios';
import ProductModal from './ProductModal';
import Pagination from './Pagination';

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
  const [pagination, setPagination] = useState({});
  const modalRef = useRef(null);
  const bsModalRef = useRef(null);

  useEffect(() => {
    bsModalRef.current = new Modal(modalRef.current);

    modalRef.current.addEventListener('hidden.bs.modal', () => {
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

  async function getProducts(page = 1) {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
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

  function openCreateModal() {
    setTempProduct({...INITIAL_TEMPLATE_DATA}); // 傳入新的物件以確保重新渲染
    setModalType("create");
    openModal();
  }
  
  function openEditModal(product) {
    setTempProduct(product);
    setModalType("edit");
    openModal();
  }

  function openDeleteModal(product) {
    setTempProduct(product);
    setModalType("delete");
    openModal();
  }

  // Modal 內的事件開始
  async function handleModalSave(product) {
    // 清空 product.imagesUrl 裡的空字串
    const newImagesUrl = product.imagesUrl?.filter((url) => url !== "") || [];
    const savingProduct = {
      ...product,
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
              <button type="button" className="btn btn-primary" onClick={openCreateModal}>建立新的產品</button>
            </div>
            <table className="table mb-4">
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
                            onClick={() => openEditModal(product)}>
                            編輯
                          </button>
                          <button type="button" className="btn btn-outline-danger btn-sm"
                            onClick={() => openDeleteModal(product)}>
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
            <Pagination pagination={pagination} onPageChange={getProducts} />
          </div>
        </div>
      </div>
      <ProductModal ref={modalRef}
        type={modalType}
        currentProduct={tempProduct}
        onSave={handleModalSave}
        onDeleteConfirm={handleDeleteConfirm}
       />
    </>
  );
}

export default ProductList;