import { ComboForm } from "../Components/Admin/Combo/ComboForm";
import ProductEdit from "../Components/Admin/Produto/ProductEdit";
import ProductForm from "../Components/Admin/Produto/ProductForm.tsx";
import ProductList from "../Components/Admin/Produto/ProductList.tsx";

export function Admin() {
  return (
    <div className="relative pt-5">
      <ProductForm />
      <ProductList />
      <ProductEdit />
      <div id="combos">
        <ComboForm />
      </div>
    </div>
  );
}
