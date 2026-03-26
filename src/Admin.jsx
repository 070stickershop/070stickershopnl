import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    img: "",
    group: "accessoires",
    badge: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*");
    if (data) setProducts(data);
  }

  async function addProduct() {
    if (!newProduct.title || !newProduct.price) return;

    await supabase.from("products").insert([
      {
        title: newProduct.title,
        price: parseFloat(newProduct.price),
        img: newProduct.img,
        group: newProduct.group,
        badge: newProduct.badge
      }
    ]);

    setNewProduct({
      title: "",
      price: "",
      img: "",
      group: "accessoires",
      badge: ""
    });

    fetchProducts();
  }

  async function updatePrice(id, price) {
    await supabase
      .from("products")
      .update({ price: parseFloat(price) })
      .eq("id", id);

    fetchProducts();
  }

if (!loggedIn) {
  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Login</h2>
      <input
        type="password"
        placeholder="Wachtwoord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={() => {
          if (password === "070admin") {
            setLoggedIn(true);
          } else {
            alert("Fout wachtwoord");
          }
        }}
      >
        Login
      </button>
    </div>
  );
}

return (
  <div style={{ padding: 20 }}>
    <h1>Admin Panel</h1>

      <h2>Nieuw product</h2>
      <input placeholder="Titel"
        value={newProduct.title}
        onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
      />
      <input placeholder="Prijs"
        value={newProduct.price}
        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
      />
      <input placeholder="Image /img/..."
        value={newProduct.img}
        onChange={e => setNewProduct({ ...newProduct, img: e.target.value })}
      />
      <button onClick={addProduct}>Toevoegen</button>

      <h2>Producten</h2>

      {products.map(p => (
        <div key={p.id} style={{ marginBottom: 10 }}>
          <b>{p.title}</b><br />
          € {p.price}<br />

          <input
            defaultValue={p.price}
            onBlur={(e) => updatePrice(p.id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}