// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;
 
contract auction {
    address highestBidder;
    uint highestBid;
    mapping (address => uint) refunds;
  
    function bid() payable public {
        require(msg.value >= highestBid);
        
        if (highestBidder != address(0)) {
            refunds[msg.sender] += highestBid;
        }
 
       highestBidder = msg.sender;
       highestBid = msg.value;
    }

    function askRefund() external {
        uint tmp = refunds[msg.sender];
        refunds[msg.sender]=0;
        (bool success, ) = msg.sender.call{value:tmp}("");
        require(success);
    }
    
}
