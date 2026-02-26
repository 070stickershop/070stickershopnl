import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

const ADMIN_PASSWORD = "antiajax070";

export default function Admin() {
  const [authorized, setAuthorized] = useState(false);
  const [input, setInput] = useState("");
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    image: "",
    description: ""
  });

  const [priceRows, setPriceRows] = useState([{ quantity: "", price: "" }]);

  async function loadProducts() {
    const { data } = await supabase
      .from("products")
      .select("*, product_prices(*)")
      .order("created_at", { ascending: false });

    setProducts(data || []);
  }

  useEffect(() => {
    if (authorized) loadProducts();
  }, [authorized]);

  function handleLogin() {
    if (input === ADMIN_PASSWORD) {
      setAuthorized(true);
    } else {
      alert("Verkeerd wachtwoord");
    }
  }

  function addPriceRow() {
    setPriceRows([...priceRows, { quantity: "", price: "" }]);
  }

  function updatePriceRow(index, field, value) {
    const updated = [...priceRows];
    updated[index][field] = value;
    setPriceRows(updated);
  }

  async function addProduct() {
    if (!newProduct.name) return alert("Naam verplicht");

    const { data: productData, error } = await supabase
      .from("products")
      .insert([newProduct])
      .select()
      .single();

    if (error) return alert("Fout bij product");

    const priceInserts = priceRows
      .filter((p) => p.quantity && p.price)
      .map((p) => ({
        product_id: productData.id,
        quantity: Number(p.quantity),
        price: Number(p.price)
      }));

    if (priceInserts.length > 0) {
      await supabase.from("product_prices").insert(priceInserts);
    }

    setNewProduct({
      name: "",
      category: "",
      image: "",
      description: ""
    });
    setPriceRows([{ quantity: "", price: "" }]);

    loadProducts();
  }

  async function deleteProduct(id) {
    if (!window.confirm("Weet je zeker?")) return;

    await supabase.from("products").delete().eq("id", id);
    loadProducts();
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <h1 className="text-xl font-bold mb-4">Admin Login</h1>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border px-3 py-2 rounded-lg mr-2"
          />
          <button
            onClick={handleLogin}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="border p-4 rounded-xl mb-8">
        <h2 className="font-semibold mb-4">Nieuw product toevoegen</h2>

        <input
          placeholder="Naam"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="border px-3 py-2 rounded-lg w-full mb-2"
        />

        <input
          placeholder="Categorie"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
          className="border px-3 py-2 rounded-lg w-full mb-2"
        />

        <input
          placeholder="Afbeelding URL"
          value={newProduct.image}
          onChange={(e) =>
            setNewProduct({ ...newProduct, image: e.target.value })
          }
          className="border px-3 py-2 rounded-lg w-full mb-2"
        />

        <textarea
          placeholder="Beschrijving"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          className="border px-3 py-2 rounded-lg w-full mb-4"
        />

        <h3 className="font-semibold mb-2">Prijzen</h3>

        {priceRows.map((row, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              placeholder="Aantal"
              value={row.quantity}
              onChange={(e) =>
                updatePriceRow(i, "quantity", e.target.value)
              }
              className="border px-3 py-2 rounded-lg w-1/2"
            />
            <input
              placeholder="Prijs"
              value={row.price}
              onChange={(e) =>
                updatePriceRow(i, "price", e.target.value)
              }
              className="border px-3 py-2 rounded-lg w-1/2"
            />
          </div>
        ))}

        <button
          onClick={addPriceRow}
          className="bg-gray-300 px-3 py-1 rounded-lg mb-4"
        >
          + Aantal toevoegen
        </button>

        <div>
          <button
            onClick={addProduct}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Product toevoegen
          </button>
        </div>
      </div>

      <h2 className="font-semibold mb-4">Bestaande producten</h2>

      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded-xl mb-4">
          <div className="font-bold">{product.name}</div>
          <div className="text-sm text-gray-600">{product.category}</div>

          <div className="mt-2">
            {product.product_prices.map((p) => (
              <div key={p.id}>
                {p.quantity} stuks → €{p.price}
              </div>
            ))}
          </div>

          <button
            onClick={() => deleteProduct(product.id)}
            className="bg-red-600 text-white px-3 py-1 rounded-lg mt-3"
          >
            Verwijderen
          </button>
        </div>
      ))}
    </div>
  );
}