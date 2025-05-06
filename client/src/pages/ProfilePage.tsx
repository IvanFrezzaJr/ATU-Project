import { useState, useEffect } from "preact/hooks";
import { useLocation } from "wouter-preact";
import { getCurrentUser, updateUser } from "../services/authService";
import { searchAddress } from "../services/addressService";
import Message from "../components/Message";
import styles from '../styles/Auth.module.css';
import { useAuth } from "../context/AuthContext";
import { UserUpdate } from "../types/user";
import { uploadImage } from "../services/itemService";

const apiUrl = import.meta.env.VITE_API_URL;

const ProfilePage = () => {
    // user  
    const [userId, setUserId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [password, setPassword] = useState("");

    // address
    const [street, setStreet] = useState<string | null>(null);
    const [city, setCity] = useState<string | null>(null);
    const [state, setState] = useState<string | null>(null);
    const [postalcode, setPostalcode] = useState<string | null>(null);
    const [country, setCountry] = useState<string | null>(null);

    // page
    const [showError, setShowError] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [, navigate] = useLocation();


    const { user, token } = useAuth();

    useEffect(() => {

        if (!user) return;

        const fetchUser = async () => {
            const currentUser = await getCurrentUser(user.id);

            setUserId(currentUser.id); 
            setName(currentUser.name);
            setEmail(currentUser.email);
            setImage(currentUser.image ?? "");
            setStreet(currentUser.street ?? "");
            setCity(currentUser.city ?? "");
            setState(currentUser.state ?? "");
            setPostalcode(currentUser.postalcode ?? "");
            setCountry(currentUser.country?? "");
        }

        fetchUser();

        
      }, [user]);

    const handleSearchAddress = async (e: Event) => {
        e.preventDefault();
        if (!street) return;

        try {
            setAddressLoading(true);
            const address = await searchAddress(street);
            setAddressLoading(false);

            if (!address) {
                return;
            }

            setStreet(address.street);
            setCity(address.city);
            setState(address.state);
            setPostalcode(address.postalcode);
            setCountry(address.country);

        } catch (error) {
            console.error("Error fetching user:", error);
            setErrorMessage("Failed to load user data.");
            setShowError(true);
        }
    };


    const handleUpdate = async (e: Event) => {
        e.preventDefault();


        if ((!userId) || (!token)){
            console.error("User not authenticated");
            navigate("/login"); 
            return;
        }

        try {
            const payload: UserUpdate = {
                name,
                email,
                image: image || undefined,
                password: password || undefined,
                street: street || undefined,
                city: city || undefined,
                state: state || undefined,
                postalcode: postalcode || undefined,
                country: country || undefined,
            };

            const updatedUser = await updateUser(userId, payload, token);
            console.log("Updated user:", updatedUser);
            navigate("/");
        } catch (error) {
            console.error("Error updating user:", error);
            setErrorMessage("Failed to update profile. Please try again.");
            setShowError(true);
        }
    };

    const handleImageUpload = async (file: File) => {
        try {
          const imagePath = await uploadImage(file);
          setImage(imagePath);
        } catch (err) {
          console.error("Failed to upload image:", err);
        }
      };
      
    


    return (
        <main>
            
                <div class="viewport">
                    <h1 class={styles.center}>Profile</h1>
                    <form onSubmit={handleUpdate}>
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            aria-label="Name"
                            autoComplete="name"
                            required
                            value={name}
                            onInput={(e) => setName((e.target as HTMLInputElement).value)}
                        />
                        <label>Email address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            aria-label="Email"
                            autoComplete="email"
                            required
                            value={email}
                            onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                        />
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            aria-label="Password"
                            autoComplete="current-password"
                            value={password}
                            onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                        />

                        <label for="file">User Image
                        <input
                                type="file"
                                id="file"
                                name="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if (file) {
                                        // setImageGallery(URL.createObjectURL(file));
                                        handleImageUpload(file);
                                    }
                                }}
                            />
                        </label>

                        <div id="gallery">
                            {image && <img src={`${apiUrl}${image}`} alt="Profile Preview" width="100" />}
                        </div>

                        <h2 class={styles.center}>Addresses</h2>

                        <section id="group">
                            <label>Street</label>
                            <fieldset role="group">
                                <input
                                    id="street"
                                    name="street"
                                    placeholder="Search for your address ..."
                                    aria-label="Street"
                                    autoComplete="Street"
                                    value={street ?? ""}
                                    required
                                    onChange={(e) => setStreet((e.target as HTMLInputElement).value)}
                                />
                                <input
                                    type="button"
                                    value="Search"
                                    onClick={(street) => handleSearchAddress(street)}
                                />
                            </fieldset>


                            <div id="loading">{addressLoading ? "Loadding" : ""}</div>
                        </section>

                        <label>City</label>
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            aria-label="City"
                            autoComplete="city"
                            required
                            onChange={(e) => setCity((e.target as HTMLInputElement).value)}
                            value={city ?? ""}
                        />

                        <label>State</label>
                        <input
                            type="text"
                            name="state"
                            placeholder="State"
                            aria-label="State"
                            autoComplete="state"
                            required
                            onChange={(e) => setState((e.target as HTMLInputElement).value)}
                            value={state ?? ""}
                        />

                        <label>Postalcode</label>
                        <input
                            type="text"
                            name="postalcode"
                            placeholder="Postalcode"
                            aria-label="Postalcode"
                            autoComplete="postalcode"
                            required
                            onChange={(e) => setPostalcode((e.target as HTMLInputElement).value)}
                            value={postalcode ?? ""}
                        />

                        <label>Country</label>
                        <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            aria-label="Country"
                            autoComplete="country"
                            required
                            onChange={(e) => setCountry((e.target as HTMLInputElement).value)}
                            value={country ?? ""}
                        />

                        <button type="submit">Update</button>
                    </form>
                </div>
       
            {showError && (
                <Message
                    title="Error"
                    message={errorMessage}
                    onClose={() => setShowError(false)}
                />
            )}
        </main>
    );
};

export default ProfilePage;
