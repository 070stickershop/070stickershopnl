import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

const ADMIN_PASSWORD = "antiajax070";
const [imageFile, setImageFile] = useState(null);

export default function Admin() {
  const [authorized, setAuthorized] = useState(false);
  const [input, setInput] = useState("");

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: ""
  });

  // =========================
  // LOAD DATA
  // =========================

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setOrders(data || []);
  }

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setProducts(data || []);
  }

  useEffect(() => {
    if (authorized) {
      loadOrders();
      loadProducts();
    }
  }, [authorized]);

  // =========================
  // PRODUCT FUNCTIONS
  // =========================

async function addProduct() {
  if (!newProduct.name || !newProduct.price || !imageFile) {
    alert("Vul alles in + kies een afbeelding");
    return;
  }

  const fileExt = imageFile.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(fileName, imageFile);

  if (uploadError) {
    alert("Upload mislukt");
    return;
  }

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  const imageUrl = data.publicUrl;

  await supabase.from("products").insert([
    {
      name: newProduct.name,
      price: newProduct.price,
      description: newProduct.description,
      image: imageUrl
    }
  ]);

  setNewProduct({ name: "", price: "", description: "" });
  setImageFile(null);
  loadProducts();
}

  async function deleteProduct(id) {
    if (!confirm("Weet je zeker dat je dit product wilt verwijderen?"))
      return;

    await supabase.from("products").delete().eq("id", id);
    loadProducts();
  }

  // =========================
  // LOGIN SCREEN
  // =========================

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>

          <input
            type="password"
            placeholder="Wachtwoord"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 mb-3"
          />

          <button
            onClick={() =>
              input === ADMIN_PASSWORD
                ? setAuthorized(true)
                : alert("Onjuist wachtwoord")
            }
            className="w-full bg-[#0b6e4f] text-white rounded-xl py-2 font-semibold"
          >
            Inloggen
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* ================= ORDERS ================= */}

      <div className="bg-white rounded-2xl shadow p-4 mb-8">
        <h2 className="text-lg font-semibold mb-3">Bestellingen</h2>

        <div className="mb-4 font-semibold">
          Totale omzet: €
          {orders
            .reduce((sum, o) => sum + Number(o.total || 0), 0)
            .toFixed(2)}
        </div>

        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-xl p-4 mb-4 bg-neutral-50"
          >
            <div className="font-semibold">{order.customer_name}</div>
            <div className="text-sm">{order.customer_street}</div>
            <div className="text-sm">{order.customer_postal_city}</div>

            <div className="mt-2 font-semibold">
              Totaal: €{order.total}
            </div>

            <div className="mt-2 flex items-center gap-3">
              <select
                value={order.status}
                onChange={async (e) => {
                  const newStatus = e.target.value;

                  await supabase
                    .from("orders")
                    .update({ status: newStatus })
                    .eq("id", order.id);

                  loadOrders();
                }}
                className="border rounded-lg px-2 py-1"
              >
                <option value="nieuw">Nieuw</option>
                <option value="verzonden">Verzonden</option>
                <option value="afgerond">Afgerond</option>
              </select>

              <button
                onClick={async () => {
                  if (!confirm("Weet je zeker?")) return;

                  await supabase
                    .from("orders")
                    .delete()
                    .eq("id", order.id);

                  loadOrders();
                }}
                className="bg-red-600 text-white px-3 py-1 rounded-lg"
              >
                Verwijderen
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PRODUCTS ================= */}

      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">
          Producten beheren
        </h2>

        {/* Add Product */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <input
            placeholder="Naam"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="border rounded-lg px-3 py-2"
          />
          <input
            placeholder="Prijs"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            className="border rounded-lg px-3 py-2"
          />
          <input
            placeholder="Image URL"
            value={newProduct.image}
            onChange={(e) =>
              setNewProduct({ ...newProduct, image: e.target.value })
            }
            className="border rounded-lg px-3 py-2"
          />
          <input
            placeholder="Beschrijving"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                description: e.target.value
              })
            }
            className="border rounded-lg px-3 py-2"
          />
        </div>

        <button
          onClick={addProduct}
          className="bg-green-600 text-white px-4 py-2 rounded-lg mb-6"
        >
          Product toevoegen
        </button>

        {/* Product list */}
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl p-4 mb-3 bg-neutral-50 flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{product.name}</div>
              <div>€{product.price}</div>
            </div>

            <button
              onClick={() => deleteProduct(product.id)}
              className="bg-red-600 text-white px-3 py-1 rounded-lg"
            >
              Verwijderen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}