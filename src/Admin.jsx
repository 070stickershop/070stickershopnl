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
} // 👈 DEZE WAS BELANGRIJK

async function uploadImage(file) {
  // 🔥 bestand check
  if (!file.type.includes("image")) {
    alert("Alleen afbeeldingen toegestaan");
    return null;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("Bestand te groot (max 2MB)");
    return null;
  }

  const fileName = Date.now() + "-" + file.name;

  const { error } = await supabase.storage
    .from("images")
    .upload(fileName, file);

  if (error) {
    alert("Upload mislukt: " + error.message);
    return null;
  }

  const { data } = supabase.storage
    .from("images")
    .getPublicUrl(fileName);

  return data.publicUrl;
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
<input
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = await uploadImage(file);
    if (url) {
      setNewProduct({ ...newProduct, img: url });
    }
  }}
/>
{newProduct.img && (
  <img src={newProduct.img} style={{ width: 100, marginTop: 10 }} />
)}
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