/** @jsxImportSource preact */
import { useEffect, useState } from "preact/hooks";
import { useLocation, useParams } from "wouter-preact";
import { createItem, getItemById, updateItem, uploadImage } from "../services/itemService";
import { useAuth } from "../context/AuthContext";
import { ItemStatus, TradeType, UserItemRequest } from "../types/item";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FormField } from "../components/FormField";
import { GlobalMessage } from "../components/GlobalMessage";
import { useFormErrors } from "../hooks/useFormErrors";
import { validateName } from "../utils/validators";

const apiUrl = import.meta.env.VITE_API_URL;

export default function ItemFormPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { token, user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: ItemStatus.InOffer,
    tradeType: TradeType.post,
    quantity: 1,
    images: [] as string[],
  });

  const { errors, setFieldError, clearFieldError, setErrors } = useFormErrors<typeof form>();
  const [globalMessage, setGlobalMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!token) navigate("/");
  }, [token]);

  useEffect(() => {
    if (id && token) {
      getItemById(parseInt(id)).then((item) => {
        setForm({
          name: item.name,
          description: item.description,
          status: item.status,
          tradeType: item.tradeType || TradeType.post,
          quantity: item.quantity,
          images: item.imagesPath || [],
        });
      });
    }
  }, [id, token]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'quantity' ? parseInt(value) : value });
  };

  const handleBlur = (field: string) => {
    let error = "";
    if (field === "name") error = validateName(form.name) || "";
    error ? setFieldError(field as keyof typeof form, error) : clearFieldError(field as keyof typeof form);
  };

  const handleFileChange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const fileList = target.files;
    if (!fileList) return;

    const uploadedPaths: string[] = [];
    for (const file of Array.from(fileList)) {
      const path = await uploadImage(file);
      uploadedPaths.push(path);
    }

    setForm({ ...form, images: [...form.images, ...uploadedPaths] });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!token || !user) return;

    const nameErr = validateName(form.name);
    if (nameErr) {
      setErrors({ name: nameErr });
      setGlobalMessage({ type: "error", text: "Error validating the form." });
      return;
    }

    const payload: UserItemRequest = {
      name: form.name,
      description: form.description,
      status: form.status,
      tradeType: form.tradeType,
      quantity: form.quantity,
      imagesPath: form.images,
      userId: parseInt(user.id),
    };

    try {
      if (id) {
        await updateItem(parseInt(id), payload, token);
      } else {
        await createItem(payload, token);
      }

      setGlobalMessage({ type: "success", text: id ? "Item updated" : "Item created" });
      navigate("/items");
    } catch (error) {
      console.error("Error saving item:", error);
      setGlobalMessage({ type: "error", text: "Failed to save item." });
    }
  };

  return (
    <div>
      <Header />
      <main>
        <div class="viewport">
          <div class="grid flex-between">
            <div><h1>{id ? "Edit Item" : "Create Item"}</h1></div>
            <div><button onClick={() => navigate("/admin/items")}>Voltar</button></div>
          </div>
          {globalMessage && (
            <GlobalMessage
              type={globalMessage.type}
              message={globalMessage.text}
              onClose={() => setGlobalMessage(null)}
            />
          )}

          <form onSubmit={handleSubmit}>


            <FormField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={() => handleBlur("name")}
              error={errors.name}
            />

            <FormField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />

            <label>Status</label>
            <fieldset>
              <div class="grid">
                <label><input type="radio" name="status" value={ItemStatus.InOffer} checked={form.status === ItemStatus.InOffer} onChange={() => setForm({ ...form, status: ItemStatus.InOffer })} /> In offer</label>
                <label><input type="radio" name="status" value={ItemStatus.NotListed} checked={form.status === ItemStatus.NotListed} onChange={() => setForm({ ...form, status: ItemStatus.NotListed })} /> Not listed</label>
                <label><input type="radio" name="status" value={ItemStatus.OfferAgreed} checked={form.status === ItemStatus.OfferAgreed} onChange={() => setForm({ ...form, status: ItemStatus.OfferAgreed })} /> Offer agreed</label>
              </div>
            </fieldset>

            <label>Trade Type</label>
            <fieldset>
              <div class="grid">
                <label><input type="radio" name="tradeType" value={TradeType.post} checked={form.tradeType === TradeType.post} onChange={() => setForm({ ...form, tradeType: TradeType.post })} /> Post</label>
                <label><input type="radio" name="tradeType" value={TradeType.delivery} checked={form.tradeType === TradeType.delivery} onChange={() => setForm({ ...form, tradeType: TradeType.delivery })} /> Delivery</label>
                <label><input type="radio" name="tradeType" value={TradeType.pickup} checked={form.tradeType === TradeType.pickup} onChange={() => setForm({ ...form, tradeType: TradeType.pickup })} /> Pickup</label>
              </div>
            </fieldset>

            <FormField
              label="Quantity"
              name="quantity"
              type="number"
              value={form.quantity.toString()}
              onChange={handleChange}
            />

            <label for="file">Images</label>
            <input type="file" id="file" accept="image/*" multiple onChange={handleFileChange} />

            <div>
              {form.images.map((img, index) => (
                <div class="upload-image-container" key={index}>
                  <button
                    class="upload-close-button"
                    onClick={(e) => {
                      e.preventDefault();
                      setForm({
                        ...form,
                        images: form.images.filter((_, i) => i !== index),
                      });
                    }}
                  >
                    ❌
                  </button>
                  <img src={`${apiUrl}${img}`} alt={`Item ${index}`} />
                </div>
              ))}
            </div>

            <div>
              <button type="submit">{id ? "Update" : "Create"}</button>
            </div>

          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
