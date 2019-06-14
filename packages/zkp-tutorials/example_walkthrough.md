Zero Knowledge Proofs involve proving that a set of values have *some property* without revealing anything else about those values. 
This is done by running some function over the private values, and then making the result of that function public. 


The purpose of this example is to show how we can use simple algebra to prove a specific property about a set of numbers without revealing anything else about those numbers. 


Suppose you are in posession of two numbers, $a$ and $b$. 

The property about $a$ and $b$ you are trying to prove is that one of them is even, and the other one is odd. 
You want to do this without leaking anything else about $a$ or $b$. 

### The Intuition Behind the Proof

Lets say you start out with one even number and one odd number. For clarity's sake, lets suppose that $a$ is odd and that $b$ is even. 

In step 1, I will give you two odd numbers and you calculate the two values of $x*a$ and $y*b$.  

Since both $x$ and $a$ are odd, it follows that $x*a$ is odd.  
*This follows from the fact that the product of two odd numbers is always odd.*

On the other hand, since $y$ is odd, but $b$ is even, $y*b$ must be even.  
*This follows from the fact that any number multiplied by an even number is even.*

In other words, multiplying any number by an odd number *maintains its parity*. Therefore, after step 1, you have the same amount of odd numbers and the same amount of even numbers that you started with.


Now, you compute $final\_result = x*a + y*b$ and hand that value over to the verifier. The verifier cannot glean information about the values of $a$ and $b$ but they can still verify your claim about $a$ and $b$ by checking whether or not $final\_result$ is odd.

If $final\_result$ is odd, then either $x*a$ is odd and $y*b$ is even or vica-versa.  
*This follows from the fact that the sum of two integers is always even unless exactly one of its summands is odd and the other one is even.*

If $final\_result$ is odd, then the verifier **accepts** the proof. Otherwise, the verifier **rejects** the proof.

### The Interaction Between the Prover and the Verifier

### Commitment Functions
In order for the zero-knowledge proof to work, we will need something called a **commitment**. I won't be explaining much about commitments for right now (read more about them here).
All you need to know about **commitments** right now is the following:


a `commitment` is a function whose input and output are both positive integers.

`````go
func commitment(uint x) uint{
    uint y;
...
    return y;
}
`````

Keep this in mind, we'll be coming back to commitments later.

### The Back And Forth between Prover and Verifier
In the following back and forth, the prover and the verifier will be sharing information with eachother. In real life, they would be sending the information
to a shared database such as a smart contract. For this example, we will convey this idea by creating a map that the user and the verifier will pass back and forth between eachother. 
The prover will be passing their private values into functions and only inserting the **return** values of those functions into the shared map. 

Each party will use values put into the shared map to compute their respective sides of the proof.



````go
shared_info := map[string]int{
    "prover_commitment_a": 0,
    "prover_commitment_b": 0,
    "verifier_oddInt_x":   0,
    "verifier_oddInt_y": 0,
    "prover_finalResult":0,
    "verifier_acceptOrReject": 0,
}
````

**You (The Prover)**: You start out by picking two numbers, `a` and `b`. One of these numbers is even. One of them is odd. You do the following:

`````go
var comm_a := commitment(a);
var comm_b := commitment(b);
shared_info["prover_commitment_a"] := comm_a;
shared_info["prover_commitment_b"] := comm_b;
`````
Now, the shared map looks as follows:

````go
shared_info := map[string]int{
    "prover_commitment_a": comm_a,
    "prover_commitment_b": comm_b,
    "verifier_oddInt_x":   0,
    "verifier_oddInt_y": 0,
    "prover_finalResult":0,
    "verifier_acceptOrReject": 0,
}
````

**Me (The verifier)**:I pick two *odd* random numbers. Let's call these random odd numbers `x` and `y`.I add `x` and `y` to the shared map.
````go
shared_info := map[string]int{
    "prover_commitment_a": comm_a,
    "prover_commitment_b": comm_b,
    "verifier_oddInt_x":   x,
    "verifier_oddInt_y": y,
    "prover_finalResult":0,
    "verifier_acceptOrReject": 0,
}
````

**You (The prover)**: You do the following:
````go
var proof := a*shared_info["verifier_oddInt_x"] + b*shared_info["verifier_oddInt_y"];
shared_info["prover_finalResult"] = proof;
````
Now the shared map looks like this:

````go
shared_info := map[string]int{
    "prover_commitment_a": comm_a,
    "prover_commitment_b": comm_b,
    "verifier_oddInt_x":   x,
    "verifier_oddInt_y": y,
    "prover_finalResult":proof,
    "verifier_acceptOrReject": 0,
}
````
**Me**: Next, I verify that you computed your proof correctly, by doing the following:
````go
func check_final_result(int final_result) bool{
    return (commitment(shared_info["prover_finalResult"]) == x*shared_info["prover_commitment_a"] + y*shared_info["prover_commitment_b"]);

    **/

}
````
Now is a good time to talk about the other properties of `commitment` that I failed to mention above. The following two statements must be true for the `commitment` function:
````go
commitment(x) + commitment(y) == commitment(x+y) // True
a*commitment(x) == commitment(a*x) // True
````
Given these properties, you can see that :   
  
`````go
commitment(shared_info[prover_finalResult])
= commitment(x*a + y*b) 
= commitment(x*a) + commitment(y*b) 
= x*commitment(a) + y*commitment(b) 
= x*shared_info[prover_commitment_a] + y*shared_info[prover_commitment_b];`
`````




The next step is checking the parity of `prover_finalResult`. If `prover_finalResult` is odd, I accept your proof. If `prover_finalResult` is even, I reject your proof. 

`````go
func is_proof_valid(int final_result) bool{
    if(check_final_result(final_result)){
       return (final_result % 2 != 0); //return true if final_result is odd, else return false
    }
    return false;
}
var proofValiditiy:=is_proof_valid(shared_info["prover_finalResult"]);
shared_info["verifier_acceptOrReject"]:=proofValidity;
`````
The final object will look like this:

````go
shared_info := map[string]int{
    "prover_commitment_a": comm_a,
    "prover_commitment_b": comm_b,
    "verifier_oddInt_x":   x,
    "verifier_oddInt_y": y,
    "prover_finalResult":proof,
    "verifier_acceptOrReject": proofValidity
}
````

### Logic Table for Summing Integers of Different Parity

+:----:+:----:+:----:+:----:+:----:+
| even |  $+$ | odd  |  =   | even |
+------+------+------+------+------+
| even |  $+$ | even |  =   | even |
+------+------+------+------+------+
| odd  |  $*$ | even |  =   | odd  |
+------+------+------+------+------+
| odd  |  $*$ | odd  |  =   | even |
+------+------+------+------+------+

+:----:+:---:+:----:+
| even | odd | odd  |
+------+-----+------+
| even | even| even |
+------+-----+------+
| odd  | even| odd  |
+------+-----+------+
| odd  | odd | even |
+------+-----+------+





+:----:+:----:+:----:+:----:+:----:+
| even |  $*$ | odd  |  =   | even |
+------+------+------+------+------+
| even |  $*$ | even |  =   | even |
+------+------+------+------+------+
| odd  |  $*$ | even |  =   | odd  |
+------+------+------+------+------+
| odd  |  $*$ | odd  |  =   | even |
+------+------+------+------+------+




