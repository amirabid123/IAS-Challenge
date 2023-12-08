import React, {useState} from 'react';
import Web3 from 'web3';
import truffleContract from 'truffle-contract';
import { useLocation } from 'react-router-dom';
import SupplyChain from '../../../contracts/SupplyChain.json';

function AddTrees() {

  const [Dval,setDval]= useState("");
  const [Vval,setVval]= useState("");
  const [Nval,setNval]= useState("");
  const location = useLocation();
  const { landid } = location.state;
 
  const handlesubmit = async (event) => {
    event.preventDefault();

    const provider = window.ethereum;
    const web3 = new Web3(provider);
    await provider.enable();

    const contract = truffleContract(SupplyChain);
    contract.setProvider(provider);

    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];

    try {
      const instance = await contract.deployed();
        
      const result = await instance.olivePlantItem(owner, landid, Nval, Vval,Dval, { from: owner });
      const data = {
        olive_id: result.logs[0].args[0],
        id: owner, 
        oliveVariety: Vval,
        plantDate: Dval,
        nbTrees: Nval,
        land_id : landid
      };
      fetch("http://localhost:5050/lands/addTree", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            // do something with the response data
          })
          .catch(error => {
            console.error(error);
            // handle the error
          });
        console.log('Transaction completed!');
        window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div id='cont' className='container mx-auto '>
       
      
     
      <div className="flex justify-center items-center ">
        <div className='main-harvest' >
          <div className='harvest-contain'>

            <div  className="titleflex flex-col items-center">
                <h6 className="text-3xl front-blod" style={{color : 'rgb(42, 128, 0)', paddingBottom: 20}}>Add Trees</h6>
            </div>

            <form className="py-1" onSubmit={handlesubmit}>
              <div className="flex flex-col item-center gap-2 ">
                
                    
                <label className="input-label" htmlFor="number-input">Number of Trees</label>
                <input className='textbox' id='number-input' type='text' value={Nval}
                        onChange={(e)=>{setNval(e.target.value)}}/>

                <label className="input-label" htmlFor="variety-input">Olive Variety</label>
                <input className='textbox' id='variety-input' type='text' value={Vval}
                        onChange={(e)=>{setVval(e.target.value)}} />

                <label className="input-label" htmlFor="date-input">Planting Date</label>
                <input className='textbox' id='date-input' type='date' value={Dval}
                        onChange={(e)=>{setDval(e.target.value)}}/>
                               
                <br/>
                <button className="btn" type="submit">Add</button>
                </div>
              </form>
          </div>


        </div>
      </div>
      
      
    </div>
    </div>
    
    
    
    
  );
}

export default AddTrees;
