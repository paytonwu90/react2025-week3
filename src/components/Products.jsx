import { useState } from 'react';

function Products({ products }) {
  const [tempProduct, setTempProduct] = useState(null);
  
  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-8">
          <h2>產品列表</h2>
          <div className="text-end mb-4">
            <button type="button" className="btn btn-primary">建立新的產品</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>產品名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>是否啟用</th>
                <th>查看細節</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {products && products.length > 0 ? (
                products.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.origin_price}</td>
                    <td>{item.price}</td>
                    <td>{item.is_enabled ?
                      <span className="text-success">啟用</span> :
                      <span className="text-danger">未啟用</span>
                    }</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setTempProduct(item)}
                      >
                        查看細節
                      </button>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button type="button" className="btn btn-outline-primary btn-sm">
                          編輯
                        </button>
                        <button type="button" className="btn btn-outline-danger btn-sm">
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
        <div className="col-md-4">
          <h2>單一產品細節</h2>
          {tempProduct ? (
            <div className="card mb-3">
              <img
                src={tempProduct.imageUrl}
                className="card-img-top primary-image"
                alt="主圖"
              />
              <div className="card-body">
                <h5 className="card-title">
                  {tempProduct.title}
                  <span className="badge bg-primary ms-2">
                    {tempProduct.category}
                  </span>
                </h5>
                <p className="card-text">
                  商品描述：{tempProduct.description}
                </p>
                <p className="card-text">商品內容：{tempProduct.content}</p>
                <div className="d-flex">
                  <p className="card-text text-secondary">
                    <del>{tempProduct.origin_price}</del>
                  </p>
                  元 / {tempProduct.price} 元
                </div>
                <h5 className="mt-3">更多圖片：</h5>
                <div className="d-flex flex-wrap">
                  {tempProduct.imagesUrl?.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      className="images"
                      alt="副圖"
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-secondary">請選擇一個商品查看</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;