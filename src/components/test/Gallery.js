//view uploaded file v1
// const initialized = useRef(false);
// useEffect(() => {
//   if (!initialized.current) {
//     //////////// questa sezione di codice serve solo perchè il progetto viene sviluppato
//     initialized.current = true; //////////// in <React.StrictMode> quindi avrei le immagini duplicate,
//     listAll(
//       ref(fireStorage, "fireImage")
//       // ref(
//       //   fireStorage,
//       //   "users-private-folders/" + authUser.email + "-id/files"
//       // )
//     ).then((allFile) => {
//       allFile.items.forEach((val) =>
//         getDownloadURL(val).then((url) => {
//           setPhotoGallery((data) => [...data, url]);
//         })
//       );
//     });
//   }
// }, []);
