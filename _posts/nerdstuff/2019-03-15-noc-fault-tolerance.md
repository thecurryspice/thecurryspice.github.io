---
layout: post
title: Fault Tolerance on Network-On-Chips
category: techblog
date: 2020-06-15
---


I spent a major part of my junior year working under [Dr. Soumya J](https://universe.bits-pilani.ac.in/Hyderabad/soumyaj/Profile)'s guidance. Her research on Network On Chips seemed fascinating to me because the potential of NoCs seemed to be a leap in the future of system organisation.

However, being a beginner in Computer Architecture, all I could deliver in a 6 month long project was a not-so-detailed literature review of existing routing algorithms, and an elementary attempt to make a routing algorithm [NoC simulator in Python](https://github.com/arbaranwal/noc).  
Eventually, I tried my shot in other fields - MEMS and Robotics. However, I was mesmerized by the art that CompArch is, and returned to the field, spending time as a guest researcher with the [Chair for Processor Design, CFAED](https://cfaed.tu-dresden.de/pd-about). My learnings during this time sparked my interest towards NoCs yet again.

---
<br>
<br>
## Pre-requisites

I wanted:
* to develop a **generic algorithm** that any topology could survive with - didn't want consider hierarchies of communication networks just yet.
* to keep **scalability** in mind - wanted to have run-time flexibility.

Keeping these two pre-requisites in mind, I am planning to modify some parts of the algorithm over the months as I gain more knowledge about CompArch. Maybe later, I'll realise this plan is not worth it, or there are just too many corner cases to consider. Who knows?  
Anyway, here's to fault-tolerance.

---
<br>
<br>
## Generic Idea

Let's consider an example network that we'll constantly refer.

```


    [S1]<-------->[S0]
     ^             ^
     |             |
     |             |
     |             |
     v             v
    [S2]<-------->[S4]<-------->[S7]
     ^             ^             ^
     |             |             |
     |             |             |
     |             |             |
     v             v             |
    [S3]<-------->[S5]<-------->[S6]<---------[S8]


-------------
| Network A |
-------------
```


* Each node `Si` depicts a typical router.
* The number of nodes it connects to determine the number of links it possesses.
* Notice that the graph also shows bidirectional links determined by the arrows pointing in the relevant directions. For example, `S6` has a bidrectional link with `S5` but a unidirectional link with `S8`. `S8` can be considered an IP that never receives a message.

To enable fault-tolerance, _my general idea is to have an **awareness-map** in each router._ This means that the routers should be able to disocciate between a data-packet and a control-packet. For now, let us implement this by adding 1 bit `Ctrl_DataN` to the streaming interface (link) bus. If this bit is 1, the value is a control-packet, otherwise a data-packet.  
For readers worrying about area overhead in routing, I would humbly suggest the addition of one more bit in the packet itself. It has its own quirks though, involving the storing and parsing of the control packet - requiring dedicated coupled memory and associated hardware logic in each router.  
What's important right now is to consider the dissociation of the control and the data plane.

The task of making the routers aware of each other (not just their immediate neighbour) will be handled by the control plane.  
Assuming the network above, we can create a simple 64 bit connectivity graph like so:

```

    | S0 | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 |
--------------------------------------------------
 S0 |    |  X |    |    |  X |    |    |    |    |
--------------------------------------------------
 S1 |  X |    |  X |    |    |    |    |    |    |
--------------------------------------------------
 S2 |    |  X |    |  X |  X |    |    |    |    |
--------------------------------------------------
 S3 |    |    |  X |    |    |  X |    |    |    |
--------------------------------------------------
 S4 |  X |    |  X |    |    |  X |    |  X |    |
--------------------------------------------------
 S5 |    |    |    |  X |  X |    |  X |    |    |
--------------------------------------------------
 S6 |    |    |    |    |    |  X |    |  X |    |
--------------------------------------------------
 S7 |    |    |    |    |  X |    |    |    |    |
--------------------------------------------------
 S8 |    |    |    |    |    |    |  X |    |    |


------------------------------------
| Connectivity Graph for Network A | --> X represents a set bit
------------------------------------
```

If a row element `Si` can send a packet towards column element `Sj`, then `(Si,Sj)` will be set.

_Usually_, routing is calculated through a heuristic, which is dimensionally-ordered. This can either be hardcoded for a design that assumes strict routing policies, or can be a one-two cycle calculation/memory-access in the routing pipeline for a design that wants to remain flexible.  
This can be done easily by setting up a look-up-table in a close-coupled memory within the router architecture.<br>
Let's consider a pipeline for routing where for every packet received, a coupled memory access within the router is made to check which neighbour to forward the packet to.  
For example, if X-Y routing (with X prioritised) is being followed by routers in `network A`, here is an example of what the proxy routing table will look like for `S4`.

```
    | S0 | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 |
--------------------------------------------------
 S0 |    |  X |    |    |  X |    |    |    |    |
--------------------------------------------------
 S1 |  X |    |  X |    |    |    |    |    |    |              ---------------------
--------------------------------------------------              | Dest | Proxy Dest |
 S2 |    |  X |    |  X |  X |    |    |    |    |              ---------------------
--------------------------------------------------              |  S0  |     S0     |
 S3 |    |    |  X |    |    |  X |    |    |    |              |  S1  |     S2     |
--------------------------------------------------              |  S2  |     S2     |
 S4 |  X |    |  X |    |    |  X |    |  X |    |              |  S3  |     S2     |
--------------------------------------------------              |  S4  |     --     |
 S5 |    |    |    |  X |  X |    |  X |    |    |              |  S5  |     S5     |
--------------------------------------------------              |  S6  |     S5     |        
 S6 |    |    |    |    |    |  X |    |  X |    |              |  S7  |     S7     |         
--------------------------------------------------              |  S8  |     --     |         
 S7 |    |    |    |    |  X |    |    |    |    |              ---------------------         
--------------------------------------------------              
 S8 |    |    |    |    |    |    |  X |    |    |        

------------------------------------                        ------------------------------
| Connectivity Graph for Network A |                        | Proxy Routing table for S4 |
------------------------------------                        ------------------------------
```
It can very well be seen that saving calculation-overhead is as straightforward as installing a content addressable memory for the routing logic. This gives **O(1)** access time, albeit taking a few bytes worth of area and power for storing the routing information.

---
<br>
<br>
## Injecting Faults

Now let's inject some faults in Network A.

```


    [S1]<-------->[S0]
     ^             
     |             
     |             
     |             
     v             
    [S2]<-------->[S4]--------->[S7]
     ^                           ^
     |                           |
     |                           |
     |                           |
     v                           |
    [S3]<-------->[S5]          [S6]<---------[S8]


-------------
| Network B |
-------------
```

Correspondingly, the 64 bit connectivity graph will look like:


```

    | S0 | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 |
--------------------------------------------------
 S0 |    |  X |    |    |    |    |    |    |    |
--------------------------------------------------
 S1 |  X |    |  X |    |    |    |    |    |    |
--------------------------------------------------
 S2 |    |  X |    |  X |  X |    |    |    |    |
--------------------------------------------------
 S3 |    |    |  X |    |    |  X |    |    |    |
--------------------------------------------------
 S4 |    |    |  X |    |    |    |    |  X |    |
--------------------------------------------------
 S5 |    |    |    |  X |    |    |    |    |    |
--------------------------------------------------
 S6 |    |    |    |    |    |    |    |  X |    |
--------------------------------------------------
 S7 |    |    |    |    |    |    |    |    |    |
--------------------------------------------------
 S8 |    |    |    |    |    |    |  X |    |    |


------------------------------------
| Connectivity Graph for Network B |
------------------------------------

```

I've specifically chosen these faults to highlight different scenarios that bring out different error cases.
For example, `S4` suffers a bidirectional link failure with `S0` and `S5`. `S4` also suffers a unidirectional link failure with `S7`.

---
<br>
<br>

## Fault Tolerance

Knowledge of the number of total nodes is required at design time to finalise on the size of coupled-memory associated to store the _awareness matrix_. The following sequence is triggered by a router `Sm` that recognises that one of its links has failed.

### Algorithm

* `Sm` will send a discovery packet to all its neighbours `Sn`.
* `Sn` checks whether it has a _vacant peripheral neighbour_ `Sp` that hasn't already sent a discovery packet to `Sn`. If yes, it sends its own discovery request to `Sp` (excluding `Sm`). This **recursion** of discovery requests repeats until a terminal node `St` is reached which doesn't have a _vacant peripheral neighbour_.
* Every node `Sp` that receives a discovery request must respond to this discovery request by returning a corresponding acknowledgement packet to `Sn`.
* The acknowledgement-packet is the entire awareness matrix. On reception of link status from corresponding `Sp`, `Sn` updates _only its corresponding row_ in the matrix. To clairfy, if an acknowledgement is received by `Sn` from `Sp`, `Sn` sets the bit `(Sp, Sn)`. This directly means that each router marks links that have a valid **hard-connect**. Two routers are termed _Hard-Connected_ if the hop count for a packet streaming between them is 1.<br>
_Note that a router might not be hard-connected to its neighbour in case of faults in bidirectional links_.


### Regenerating Proxies

As discussed previously, the heuristic stage can be based on a small lookup-table.<br>
A typical implementation will contain destination nodes marked against mapped proxy-destinations as shown previously for node `S4`.  
Let's try regenerating the mapping table for node `S4` in case of `Network B`.


```

    | S0 | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 |
--------------------------------------------------
 S0 |    |  X |    |    |    |    |    |    |    |
--------------------------------------------------
 S1 |  X |    |  X |    |    |    |    |    |    |          ------------------------------------------------------
--------------------------------------------------          | Dest | Prev Proxy | 1st Pass | 2nd Pass | 3rd Pass |
 S2 |    |  X |    |  X |  X |    |    |    |    |          ------------------------------------------------------
--------------------------------------------------          |  S0  |     S0     |    NC    |    NC    |    S2    |
 S3 |    |    |  X |    |    |  X |    |    |    |          |  S1  |     S2     |    NC    |    S2    |    S2    |
--------------------------------------------------          |  S2  |     S2     |    S2    |    S2    |    S2    |
 S4 |    |    |  X |    |    |    |    |  X |    |          |  S3  |     S2     |    NC    |    S2    |    S2    |
--------------------------------------------------          |  S4  |     --     |    --    |    --    |    --    |
 S5 |    |    |    |  X |    |    |    |    |    |          |  S5  |     S5     |    NC    |    NC    |    S2    |
--------------------------------------------------          |  S6  |     S5     |    NC    |    NC    |    NC    |
 S6 |    |    |    |    |    |    |    |  X |    |          |  S7  |     S7     |    S7    |    S7    |    S7    |
--------------------------------------------------          |  S8  |     --     |    --    |    --    |    --    |
 S7 |    |    |    |    |    |    |    |    |    |          ------------------------------------------------------
--------------------------------------------------                   buf_idx = 0  buf_idx=1  buf_idx=0  buf_idx=1
 S8 |    |    |    |    |    |    |  X |    |    |


------------------------------------
| Connectivity Graph for Network B |
------------------------------------
```

The router shall make use of the existing proxy table and the awareness matrix to check for a path to all its destinations.<br>
* In the first pass, all proxies are removed. This means that only the hard-connected links will survive. All other proxies are marked `NC` (not connected).
* During the second pass, the hard-connected elements are checked for connections in the awareness matrix, and the corresponding proxies are updated.
* Since a maximum of `N` passes will have to be made, and each pass simply appends to the knowledge existing in the previously generated proxy table, only two columns being used as a ring buffer will suffice for these calculations.

As an example, `S4` is hard-connected only to `S2` and `S7`, hence all other nodes are marked `NC`.<br>
For the second pass, `S2` is connected to `S1` and `S3` in the awareness matrix, so the proxy can be updated with `S1` and `S3` getting routed through `S2`. Similarly, in the third pass, newly updated connection `S1` is found to be connected to `S0` and `S3` is found connected to `S5`. By the end of the third pass, S4 realises it can route all these packets to `S2`.
The last new entries made are for `S0` and `S5`, both of which don't result in a change in the proxy table. Once this is achieved, we can conclude that all paths have been traversed.<br>
Note that the proxy table clearly recognised that `S4` has severed all connections to `S6`.<br>

---
<br>
<br>

## Scalability

A huge focus for any stable architecture should be a scalability goal. A major reason why this project remained unimplemented was because I could not come up with a method to make this scalable. However, as I learnt more about NoCs through the book [On Chip Networks](https://www.morganclaypool.com/doi/10.2200/S00772ED1V01Y201704CAC040), I realised a great deal of the problems, constraints, trade-offs, and associated research that already exist in this domain.<br>
Implementing each router with a reprogrammable logic can be significantly taxing in terms of area and power. If there were to be a 100 IPs in a network, the connectivity graph would scale exponentially, and so would the complexity of the associated comparison/reprogramming logic.<br>
Therefore, the problem at hand is essentially to find a sweet-spot between concrete-designs and abused-redundancy.


```
                             Z1---,      ,----Y4-----Y5
    X1-->>>--X2-.                  \    /
                 \             ~~~~~~~~~~~~~~
                  X3----X4----| Intersection |----Z2-----Z3
                               ~~~~~~~~~~~~~~
                        --Y3------'     `----,
                       /                      \
            Y1----Y2--'                        '---X5

-------------
| Network C |
-------------
```

Think train stations.  
Think of train `>>>` choo-chooing its way from `X1` to `Y5` through a maze of stations as described in `Network C`. For a traveller on that train, the local visibility of every station is not required, as she cannot choose to deviate from a fixed path containing all `Xs` or all `Ys`. To reroute to a station on a different line, she has to wait until she reaches an intersection station, and then reroute herself according to the paths dictated by the Intersection.

Hence the entire onus of rerouting is contained within the Intersection and all relevant resources can be installed only in the Intersection, freeing the small nodes from rescheduling and rerouting passengers.<br>
Similarly, **some nodes in a NoC can be upgraded to Intersection nodes**. All acknowledgments received by normal nodes are streamed to intersection-nodes, therefore creating **mini-directories** in scattered sections. All calculations for regeneration of proxy-tables for a normal node can be done by its nearest Intersection node.<br>
Since the network already has a control plane, normal nodes shall be able to disocciate a proxy-update request from a data packet.

### Coherence

I have some doubts about the coherence of the model once it is scaled. Mini-directories are okay, but will give rise to coherency problems in super-large networks. There's a corner case where a new fault may occur by the time the proxy-tables are updated for each router. In such a case, one of the routers might fail to receive a proxy-update request. Handling this scenario is important for making the network truly fault-tolerant.

---
<br>
<br>

## Other Tangents

Considering the train network analogy again, there is an important observation - that a traveller is able to reroute itself based on the constrains and rules that the intersection imposes on it. It's not the intersection routing the traveller, it's the traveller choosing to take a path that it finds best.<br>
This requires a shift in philosophy of **what a message is** - a dumb, inanimate chunk of data that a router should route; or a data structure capable of letting the router know which path to take.



---
