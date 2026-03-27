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
    file: null, // 🔥 toegevoegd
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

  // 🔥 IMAGE UPLOAD (blijft hetzelfde, maar beter gebruikt)
async function uploadImage(file) {
  const fileName = Date.now() + "-" + file.name;

  await supabase.storage
    .from("images")
    .upload(fileName, file);

  const result = supabase.storage
    .from("images")
    .getPublicUrl(fileName);

  console.log("RESULT:", result);

  return result.data.publicUrl; // 🔥 FIX
}

  // 🔥 FIXED ADD PRODUCT
async function addProduct() {
  console.log("ADD PRODUCT START");

  let imageUrl = null;

  if (newProduct.file) {
    console.log("FILE FOUND");

    imageUrl = await uploadImage(newProduct.file);

    console.log("IMAGE URL NA UPLOAD:", imageUrl);
  } else {
    console.log("GEEN FILE!");
  }

  await supabase.from("products").insert([
    {
      title: newProduct.title,
      price: parseFloat(newProduct.price),
      img: imageUrl
    }
  ]);
}

  async function updatePrice(id, price) {
    await supabase
      .from("products")
      .update({ price: parseFloat(price) })
      .eq("id", id);

    fetchProducts();
  }

  // 🔐 LOGIN
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

      <input
        placeholder="Titel"
        value={newProduct.title}
        onChange={(e) =>
          setNewProduct({ ...newProduct, title: e.target.value })
        }
      />

      <input
        placeholder="Prijs"
        value={newProduct.price}
        onChange={(e) =>
          setNewProduct({ ...newProduct, price: e.target.value })
        }
      />

      {/* 🔥 FILE INPUT FIX */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;

          setNewProduct({ ...newProduct, file });
        }}
      />

      {/* 🔥 PREVIEW */}
      {newProduct.file && (
        <img
          src={URL.createObjectURL(newProduct.file)}
          style={{ width: 100, marginTop: 10 }}
        />
      )}

      <button onClick={addProduct}>Toevoegen</button>

      <h2>Producten</h2>

      {products.map((p) => (
        <div key={p.id} style={{ marginBottom: 10 }}>
          <b>{p.title}</b>
          <br />
          € {p.price}
          <br />

          {p.img && (
            <img src={p.img} style={{ width: 80, marginTop: 5 }} />
          )}

          <br />

          <input
            defaultValue={p.price}
            onBlur={(e) => updatePrice(p.id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}