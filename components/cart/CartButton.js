// "use client";
// import { useCart } from "../../context/CartContext";

// export default function CartButton({ onClick }) {
//   const { cart } = useCart();
//   const totalQty = cart.reduce((s, i) => s + i.qty, 0);

//   if (totalQty === 0) return null;

//   return (
//     <button
//       onClick={onClick}
//       className="btn btn-danger position-fixed bottom-0 end-0 m-4 rounded-circle"
//       style={{ width: 60, height: 60 }}
//     >
//       🛒
//       <span className="badge bg-dark ms-1">{totalQty}</span>
//     </button>
//   );
// }
