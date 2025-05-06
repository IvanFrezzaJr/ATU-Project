import { useEffect, useState } from "preact/hooks";
import { useLocation, useParams } from "wouter-preact";
import { createItem, getItemById, updateItem, uploadImage } from "../services/itemService";
import { useAuth } from "../context/AuthContext";
import { ItemStatus, TradeType, UserItemRequest } from "../types/item";
import Footer from "../components/Footer";
import Header from "../components/Header";

const apiUrl = import.meta.env.VITE_API_URL;

const ItemFormPage = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { token, user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ItemStatus>(ItemStatus.InOffer);
  const [tradeType, setTradeType] = useState<TradeType>(TradeType.post);
  const [quantity, setQuantity] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (id && token) {
      getItemById(parseInt(id)).then((item) => {
        setName(item.name);
        setDescription(item.description);
        setStatus(item.status);
        setQuantity(item.quantity);
        setImages(item.imagesPath || []);
      });
    }
  }, [id, token]);

  const handleFileChange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const fileList = target.files;
    if (!fileList) return;

    const uploadedPaths: string[] = [];
    for (const file of Array.from(fileList)) {
      const path = await uploadImage(file);
      uploadedPaths.push(path);
    }

    setImages([...images, ...uploadedPaths]);
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!token || !user) return;

    const payload: UserItemRequest = {
      name,
      description,
      imagesPath: images,
      quantity,
      status,
      tradeType,
      userId: parseInt(user.id)
    };

    if (id) {
      await updateItem(parseInt(id), payload, token);
    } else {
      await createItem(payload, token);
    }

    navigate("/items");
  };

  return (

    <div>
      <Header />
      <main>
        <div class="viewport">
          <h1>{id ? "Edit Item" : "Create Item"}</h1>
          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input type="text" value={name} onInput={(e) => setName((e.target as HTMLInputElement).value)} required />

            <label>Description</label>
            <textarea value={description} onInput={(e) => setDescription((e.target as HTMLTextAreaElement).value)} />

            <label>Status</label>
            <fieldset>
              <div class="grid">
                <label><input type="radio" name="status" value="in-offer" checked={status === ItemStatus.InOffer} onChange={() => setStatus(ItemStatus.InOffer)} /> In offer</label>
                <label><input type="radio" name="status" value="not-listed" checked={status === ItemStatus.NotListed} onChange={() => setStatus(ItemStatus.NotListed)} /> Not listed</label>
                <label><input type="radio" name="status" value="offer-agreed" checked={status === ItemStatus.OfferAgreed} onChange={() => setStatus(ItemStatus.OfferAgreed)} /> Offer agreed</label>
              </div>
            </fieldset>

            <label>Quantity</label>
            <input type="number" min="1" value={quantity} onInput={(e) => setQuantity(parseInt((e.target as HTMLInputElement).value))} required />

            <label for="file">User Images</label>
            <input type="file" id="file" accept="image/*" multiple onChange={handleFileChange} />

            <div id="gallery">
              {images.map((img, index) => (
                <div class="upload-image-container" key={index}>
                  <button
                    class="upload-close-button"
                    onClick={(e) => {
                      e.preventDefault();
                      setImages(images.filter((_, i) => i !== index));
                    }}
                  >
                    ❌
                  </button>
                  <img src={`${apiUrl}${img}`} alt={`Item ${index}`} />
                </div>
              ))}
            </div>

            <button type="submit">{id ? "Update" : "Create"}</button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ItemFormPage;
