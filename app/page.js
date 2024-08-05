'use client'
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button, InputAdornment, List, ListItem, ListItemText, Collapse, IconButton, fabClasses } from '@mui/material';
import { collection, query, doc, getDoc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import { TransitionGroup } from 'react-transition-group';

const FRUITS = [
  { name: 'Apple', icon: '🍏' },
  { name: 'Banana', icon: '🍌' },
  { name: 'Pineapple', icon: '🍍' },
  { name: 'Coconut', icon: '🥥' },
  { name: 'Watermelon', icon: '🍉' },
];

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      const data = doc.data();
      const quantity = data.quantity || 0;
      inventoryList.push({
        name: doc.id,
        quantity: data.quantity || 0,
        icon: data.icon || '🍌',
        ...data,
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    //Delete lines 50 and 51 if it doesn't work//
    const fruit = FRUITS.find(fruit => fruit.name.toLowerCase() === item.toLowerCase());
    if (!fruit) return;

    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const quantity = data.quantity || 0;
      await setDoc(docRef, { quantity: quantity + 1, icon: fruit.icon },{merge:true});
    } else {
      await setDoc(docRef, { quantity: 1, icon: fruit.icon});
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const quantity = data.quantity;

      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const handleSearch = () => {
    const filtered = inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Delete this if it breaks//
  const renderInventoryItem = (item) => (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          title="Delete"
          onClick={() => removeItem(item.name)}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemText primary={`${item.name} - ${item.quantity}`} />
      <Button variant="outlined" onClick={() => addItem(item.name)}>+</Button>
      <Button variant="outlined" onClick={() => removeItem(item.name)}>-</Button>
    </ListItem>
  ); //This is where it ends//

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Stack direction="row" spacing={2}>
        <TextField
          variant="outlined"
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="outlined" color="primary" onClick={handleSearch}>
          Search
        </Button>
        <IconButton aria-label="filter">
          <FilterListIcon />
        </IconButton>
      </Stack>

      <Button variant="contained" onClick={handleOpen}>Add Item</Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h6">Add item</Typography>
          <TextField
            label="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={() => {
            addItem(itemName);
            setItemName('');
            handleClose();
          }}>
            Add
          </Button>
        </Box>
      </Modal>

      <List>
        <TransitionGroup>
          {filteredInventory.map((item) => (
            <Collapse key={item.name}>{renderInventoryItem(item)}</Collapse>
          ))}
        </TransitionGroup>
      </List>

      <Box mt={2}>
        {filteredInventory.map((item) => (
          <Box key={item.name} display="flex" alignItems="center" gap={2}>
            <Typography>{item.name} - {item.quantity}</Typography>
            <Button variant="outlined" onClick={() => addItem(item.name)}>+</Button>
            <Button variant="outlined" onClick={() => removeItem(item.name)}>-</Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

    /*const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      const data = doc.data();
      const quantity = data.quantity || 0;
      inventoryList.push({
        name: doc.id,
        quantity: quantity,
        ...data,
      });
    });
    setInventory(inventoryList);
  };

      useEffect(() => {
        updateInventory();
      }, []);
      
      const addItem = async (item) => {
        const docRef = doc(collection(firestore, 'inventory'), item);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()) {
          const data = docSnap.data();
          const quantity = data.quantity || 0;
          console.log(`Adding item: ${item}, current quantity: ${quantity}`);
            await setDoc(docRef, {quantity: quantity + 1})
          }
          else{
            console.log(`Adding new item: ${item}`);

            await setDoc(docRef, {quantity: 1})
          }

    await updateInventory()
  }
  
  const removeItem = async (item) => {
        const docRef = doc(collection(firestore, 'inventory'), item);
        const docSnap = await getDoc(docRef);
        /*await deleteDoc(docRef)*/

        /*if(docSnap.exists()) {
          const data = docSnap.data();
          const quantity = data.quantity;

          if(quantity === 1) {
            await deleteDoc(docRef)
          } 
          else {
            await setDoc(docRef, {quantity: quantity - 1})
          }
        }

    await updateInventory();
  };

    useEffect(() => {
      updateInventory();
    }, []);
      
      
      const handleOpen = () => setOpen(true)
      const handleClose = () => setOpen(false)




  return( 
  <Box 
  width="100vw" 
  height="100vh" 
  display="flex" 
  flexDirection="column"
  justifyContent="center"
  alignItems="center"
  gap={2}
>
  <Modal open={open} onClose={handleClose}>
    <Box 
    position="absolute" 
    top="50%" 
    left="50%"
    width={400}
    bgcolor="white"
    border="2px solid #000"
    boxShadow="24" 
    p={4}
    display="flex"
    flexDirection="column"
    gap={3}
    sx={{
      transform: 'translate(-50%, -50%)'
    }}
    >
      <Typography variant="h6">Add item</Typography>
      <Stack width="100%" direction="row" spacing={2}>

        <TextField 
       variant="outlined"
       placeholder="Search inventory..."
       value={searchTerm}
       onChange={(e) => setSearchTerm(e.target.value)}
       fullWidth
       InputProps={{
        startAdornment: (
        <InputAdornment position="start">
        <SearchIcon />
        </InputAdornment>
       ),
  }}
  />
  </Box>
  <Button variant="outlined" color="primary">
    Search

  </Button>
  <IconButton aria-label="filter">
    <FilterListIcon />
  </IconButton>
</Stack>
  
        <Button variant="outlined" onClick={() => {
          addItem(itemName)
          setItemName('')
          handleClose
        }}
        </Button>*/