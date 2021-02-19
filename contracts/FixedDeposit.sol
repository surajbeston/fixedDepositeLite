pragma solidity 0.5.16;

contract FixedDeposit {
    uint8 public InterestRate = 10;
    
    address payable public bank;
    
    struct Deposit {
        string name;
        uint256 principle;
        uint256 dateTimeStarted;
    }
    
    event AmountRead(address indexed _from, uint256 _value, string _random);

    uint256 public thisbalance;
    
    Deposit currentDeposit;
    
    mapping (address => Deposit) public deposits;
    mapping (address => uint256) public compoundAmounts;
    
    constructor() public {
        bank = msg.sender;
    }

    
    function deposit(string memory _name) payable public {
        require (msg.sender != bank);
        require (msg.value > 0);
        uint256 _principle = msg.value;
        deposits[msg.sender] =  Deposit(_name, _principle, block.timestamp);
        bank.transfer(msg.value);
    }
    
    function viewAmount() public returns(uint256) {
        require (msg.sender != bank);
        currentDeposit = deposits[msg.sender];
        uint256 principle = currentDeposit.principle;
        // require(principle != 0);
        uint256 time = (block.timestamp - currentDeposit.dateTimeStarted)/5;
        uint256 amount = principle*(1 + (InterestRate/2))**(2*time);
        compoundAmounts[msg.sender] = amount;
        emit AmountRead(msg.sender, principle, "hero");
        return amount;
    }
    
    function withdraw(address payable _beneficiary) payable public {
        require(_beneficiary != address(0));
        _beneficiary.transfer(msg.value);
    }
}