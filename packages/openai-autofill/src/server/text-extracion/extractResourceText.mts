import type { ResourceDoc } from '@moodlenet/core-domain/resource'

export async function extractResourceText({ /* content,  */ meta }: ResourceDoc): Promise<string> {
  return ` 
  ${meta.title}
  ${meta.description}
  ABSTRACT In underwater wireless sensor networks (UWSNs), protocols with efficient energy and reliable
  communication are challenging, due to the unpredictable aqueous environment. The sensor nodes deployed
  in the specific region can not last for a long time communicating with each other because of limited energy.
  Also, the low speed of the acoustic waves and the small available bandwidth produce high latency as well as
  high transmission loss, which affects the network reliability. To address such problems, several protocols
  exist in literature. However, these protocols lose energy efficiency and reliability, as they calculate the
  geographical coordinates of the node or they do not avoid unfavorable channel conditions. To tackle these
  challenges, this article presents the two novel routing protocol for UWSNs. The first one energy path and
  channel aware (EPACA) protocol transmits data from a bottom of the water to the surface sink by taking
  node’s residual energy (Re), packet history (Hp), distance (d) and bit error rate (BER). In EPACA protocol,
  a source node computes a function value for every neighbor node. The most prior node in terms of calculated
  function is considered as the target destination. However, the EPACA protocol may not always guarantee
  packet reliability, as it delivers packets over a single path. To maintain the packet reliability in the network,
  the cooperative-energy path and channel aware (CoEPACA) routing scheme is added which uses relay
  nodes in packet advancement. In the CoEPACA protocol, the destination node receives various copies from
  the source and relay(s). The received data at the destination from multiple routes make the network more
  reliable due to avoiding the erroneous data. The MATLAB simulations results validated the performance of
  the proposed algorithms. 
  I. INTRODUCTION
  In underwater wireless sensor networks (UWSNs), the unpredictable nature of the acoustic channel poses major challenges in the designing of energy-efficient and reliable
  protocols. Energy efficiency and packets reliability have
  paramount significance in a network. Protocols having efficient energy and reliability can be used for long time
  applications such as military defense, oil/gas exploration,
  disaster prevention, and marine detection [1], [2], as in Fig. 2.
  The associate editor coordinating the review of this manuscript and
  approving it for publication was Noor Zaman .
  The underwater channel faces a number of challenges like
  multi-path fading, limited available bandwidth, and high bit
  error rate [3]. The radio waves produce high attenuation and
  absorption, therefore, the underwater networks use acoustic waves for communications [4]. However, the acoustic
  waves deliver packets with five times slower speed than radio
  waves [5].
  The localization of the underwater nodes is very difficult
  as relative to the wireless terrestrial network. The network in
  underwater is dynamic as the free movement of nodes with
  the ocean current. This can result in frequent changes in their
  position. Finding and calculating of nodes position lead the
  network to high energy consumption. The underwater nodes
  are operated with limited energy and charging or replacing the
  node’s battery is a challenging task because of the aqueous
  unpleasant environment [6]. Several protocols [7]–[9] that
  make use of localization techniques in the data forwarding
  process. Localization is employed to examine the node’s
  coordinates in the water. However, it poses several challenges such as false position calculation, high energy consumption, and high latency. The conventional protocols for
  UWSNs [10]–[13] do not take reliability into consideration
  while delivering data packets. In these protocols, a single-hop
  mechanism is used in packets advancement. In consequence,
  they are unable to achieve maximum packets advancement at
  the top level of water.
  In underwater acoustic networks, the ultimate consumption
  of the energy is because of the collision between the nodes
  during broadcasting the information bags. There are various
  protocols for UWSNs available in the literature [14]–[16] that
  minimize the energy consumption in the network. However,
  they may not achieve maximum packets at the water surface
  because the source node finds the least number of forwarding
  candidates. Therefore, the least number of forwarding candidates lead the network to less reliable. Numerous cooperative
  routing protocols in the literature, that are introduced to mitigate the low-reliability constraint in underwater communication [5], [17], [18]. In cooperative routing, the source node
  uses the two-way strategy to forwards the data to the final
  destination. On the one hand, it is to adopt the direct-hop
  communication of the sender and the point of destination.
  On the other hand, it can also involve the relay node(s) for
  the packet advancement at the water surface. This method
  maximizes the network reliability by avoiding the adverse
  channel affects. However, this type of protocol faces the problem of high latency. The forwarding of the same packet with
  two different ways tends to increase the network transmission
  delay. In addition, these protocols consume more energy as
  delivering the same packet via doublet as well as triplet
  fashion.
  A. PROBLEM STATEMENT
  Several challenges are confronted in [19] while delivering
  data from the bottom of the water towards the top surface.
  The scheme selects a node as a destination that has the lowest
  depth among all neighbors. The repeated selection of the
  lowest depth near the water surface drains the energy of the
  nodes’ batteries rapidly, as illustrated in Fig. 1. This tends
  the network to high energy consumption by the occurrence of
  void regions. In addition, this scheme makes use of multiple
  paths for packets routing from the bottom of the water to
  the final destination. The packet advancement with multiple
  routes renders high latency in the network.
  B. MOTIVATIONS
  This study is motivated by the before-mentioned facts. Consequently, this paper presents two novel algorithms for UWSNs.
  The first one is the energy path and channel aware (EPACA)
  routing protocol that brings energy efficiency in the network and can be used for long term communication. While
  the second one is the cooperative energy path and channel
  aware (CoEPACA) routing protocol that enhances reliability
  in packet delivery from a source to the point of destination.
  The CoEPACA protocol finds different routing paths to successfully delivers the packets towards the water surface.
  C. CONTRIBUTIONS
  Contributing to all published novel routing protocols in
  UWSNs, our EPACA routing scheme picks the best forwarding candidate from the neighbour node based on residual energy, packets’ history, minimal distance, and BER.
  This robust selection of the best forwarding candidates
  tends the network to energy-efficient which can be used for
  long-lasting applications like monitoring. The CoPACA routing scheme avoids the unpleasant behaviour of the channel
  and forwards the packet not only in a single way but it
  also finds multiple routes. In essence, this study presents the
  following contributions.
  • The EPACA protocol is presented to diminish the energy
  constraint in the network. The source node chooses
  the best forwarding node among neighbour nodes. The
  source node considers four metrics (residual energy,
  packet’s history, minimal distance, and BER) in the
  selection of the forwarding node.
  • The packets redundancy is controlled by selecting the
  optimal destination, which avoids retransmitting the
  same packets repeatedly. Consequently, the improved
  result is achieved in the lifetime of the networks.
  • The second proposed scheme employed the cooperative
  technique in the delivery of data packets, whereas the
  destination receives various copies.
  • The received data at the destination from multiple routes
  make the network more reliable due to avoiding the
  erroneous data. Furthermore, the source only transmits
  a robust packet to the next one, which in turn, achieves
  high packets advancement at the sink node.
  • Various protocols exist in the literature that considers
  the localization of nodes. In effect, such protocols consume more energy. Unlike these protocols, the proposed
  protocols do not take localization into account. This,
  as a result, minimizes nodes’ deployment complexity
  and also improves network scalability.
  • The CoEPACA is superior in reliability in the form of
  delivering more packets to the destination nodes. Since
  this ensures packets reliable delivery, also can be used in
  applications requiring reliable delivery of packets such
  as military applications and in undersea warning and
  havoc identification systems.
  • Thorough and careful Matlab’s simulations reveal the
  performance analysis. An improved result is achieved
  in energy cost, packets advancement towards the target,
  and network stability.
  The remaining parts of this article are partitioned as
  follows. Section II discusses the relative study of routing schemes. The proposed network model is described in
  Section III. Section V and then VI discusses the EPACA
  and CoEPACA protcols, respectively. Section VII contains
  simulation results and analysis. Finally, the entire work is
  concluded in Section VIII.
  II. RELATED WORK
  This section discusses the performance and ideas of various existing protocols. The discussion is classified into
  four categories such as energy-efficient, reliability aware,
  localization-free, and cooperative based routing protocols. Fig. 3 lists all routing schemes which are further
  described in this section one by one.
  A. ENERGY-EFFICIENT PROTOCOLS
  Various protocols are proposed in the literature that provide energy efficiency during packet forwarding. Energy efficiency is defined as the node that delivers packets towards
  the destination with the cost of minimum energy consumption. Protocols that provide energy efficiency during packets
  forwarding are listed below:
  1) DNAR
  Junaid and his colleagues [20] proposed a depth and noise
  aware routing (DNAR) in the field of UWSNs. The algorithm
  brings energy efficiency in a network by selecting the appropriate node in data delivery. When the nodes detect the data,
  they first use a weighting function for choosing the best
  forwarding node. The weighting function consists of the node
  information I.e. depth, and channel noise between the sender
  to the receiver. When the node has greater value as per the
  weighting function, then it will consider as the best forwarding node. The DNAR protocol forwards the data packets with less energy consumption. Therefore, the protocol
  presents energy efficiency in the network. The DNAR is a
  localization-free protocol and delivers maximum packets at
  the water surface with only less amount of energy consumption. However, it faces high latency due to the checking of
  channel link quality.
  2) EEORS
  Anwar et al. [21] proposed an energy-efficient optimal
  relay selection (EEORS) approach for UWSNs. The EEORS
  scheme reduces the energy consumption of the nodes. The
  picking of the best forwarder is based on the information of the lowest depth and maximum remaining energy.
  A fuzzy-logic mechanism is employed to choose the best
  forwarder from the bunch of sensor nodes in the whole network. The relay node is selected by considering the values of
  the desired weighting parameters (depth, remaining energy).
  The delivery process of packets from a sender to the destination node is done through the optimal relay node. The best
  forwarder holds the information for calculated intervals of
  time and also examines the value of BER. If the calculated
  BER is less than the predefined threshold then it forwards the
  packet to the next one. This algorithm provides good output
  in terms of energy consumption. However, it has high latency
  and packets drop during the data delivery process.
  3) SD-VBF
  Khosravi et al. [22] introduced a spherical division vectorbased forwarding (SD-VBF) routing technique for UWSNs.
  In this technique, an energy utilization mechanism is incorporated to reduce energy consumption during packets forwarding. The improvement of this scheme is carried out through
  a scenario based on physical or probable limitations. Also
  performed the direct or indirect action to remove some of the
  sensor nodes in routing which have no contribution during
  the packets forwarding. In addition, the optimal scheme for
  simplicity called scalability and efficiency are utilized to
  reduce network energy consumption. Like the VBF protocol,
  this scheme also selects the best forwarder node based on
  physical vector calculation from the desired destination. The
  SD-VBF scheme enhances the performance of the VBF routing protocol by removing some of the un contributed nodes
  during the routing. And reduces the net energy consumption
  while delivering the packet towards the destination. However,
  this protocol may not always deliver maximum packets due
  to the occurrence of void holes in the network.
  B. THROUGHPUT, RELIABILITY AWARE PROTOCOLS
  Several conventional routing protocols published in the literature that consider reliability during packets advancement
  process. The reliability of the routing protocol is defined
  as the maximum packet received at the sink surface. Protocols that provide reliability in the network are presented as
  follows:
  1) CARP
  The authors in [23] proposed a channel-aware routing protocol (CARP) to utilize the information of link conditions
  in the network. Choosing of a relay is dependent on residual energy and the history of the successful packet transmitting among the neighbors. The protocol combines the
  information of hop-count and link quality. This method is
  able to make connectivity around the shadow and nullity
  spaces in the network. The selection of an optimal link in the
  protocol gives the advantage to control the network energy.
  After the generation of information bags, the relay node(s)
  is selected through the desired parameters. The link quality
  of the protocol is based on the time-varying channel selection. This provides the ability to hold the same packet error
  rate (PER) for the data packet and controls the network power.
  The protocol achieves superior performance for the packet
  delivery ratio as compared to the counterpart scheme. Also,
  it has good energy consumption during forwarding the packets toward the destination. However, it delivers the packet
  with latency tradeoff, as it checks the history of successful
  transmission.
  2) RIAR
  A reliable and interference-aware routing (RIAR) scheme
  is proposed in [24] which mitigates the adverse channel
  effects. In the RIAR scheme, the picking of the best forwarder node depends on the desired attributes such as hop
  count, the neighbour in the communication dimension, and
  the distance. The number of hop-count is also used as a
  routing metric rather than physical distance. It is because
  the physical distance changes quickly with the water waves.
  This scheme sends the packet only, while if there is minimum interference. The source node detects the information
  packets and transmits it to the target point. The selection of
  the optimal target point is by using the function parameter.
  The node having a minimum number of hops and close of
  the surface level is accepted as the target destination. The
  destination node further selects the second destination node
  if the sink is not in its range. In such a way, the packets arrive at the sink node through passing multi-hoping.
  The protocol maximizes the rate of packets advancement
  and provides the minimum latency during the packet transmission. However, the node having the lowest depth and
  near to sink node die quickly which decreases the network
  lifetime.
  4) DBR
  Hai and his co-workers proposed a depth-based routing
  (DBR) protocol in [25]. In the DBR protocol, the nodes
  required no location information for each other. The source
  first checks the depth level of nodes which lies in its transmission range. The node having the lowest depth or near to
  the surface area will receive data and is considered as the
  first destination node. The rest of the other nodes that depth
  does not match with the source node packet information, will
  not receive data packets. The first destination node selects
  the second destination node for data forwarding, using this
  mechanism until the packet reached the sink. The DBR protocol successfully delivers information towards the sink based
  on only depth information. However, it faces with redundant
  packets’ reception problem caused by flooding manner. This,
  in turn, high energy consumption in the network.
  C. LOCALIZATION-FREE ROUTING PROTOCOLS
  Localization is defined as the calculation of the geographical
  coordinates of the node in UWSNs. Localization itself is
  one of the challenging issues because the global positioning system (GPS) is unable to work in water. As it works
  upon radio signals which have maximum attenuation and
  absorption in water. Therefore, various protocols that do not
  take localization into consideration. The discussion of the
  localization-free routing protocols is presented as:
  1) LF-IEHM
  The authors in [26] proposed a localization-free interference
  and energy hole minimization (LF-IEHM) routing scheme for
  underwater WSNs. This protocol is localization-free whereas
  no geographical portions of the nodes are required. Also,
  the sensor nodes are capable of changing their transmission
  range during communication. If the source has no neighbour
  node then it can change the transmission range and avoid
  the problem of sparse node condition. In addition, it uses
  packets history to reduces the probability of packets collision
  at the destination point. The protocol has a high achievement
  for throughput. But, it consumes more energy during packets
  delivery from one point to another.
  2) ODBR
  Reference [27] shows the information of localization-free
  namely the optimized depth-based routing (ODBR) protocol.
  In this protocol, the source considers only depth information
  and forwards packets over a single-path to the destination
  point. The nodes that reside near the water surface are energized with more energy as compared to the farther one.
  Therefore, this arrangement results in better energy balancing. However, the nodes deployed at the ocean bottom die
  quickly due to continuous uses with less assigned energy.
  Also, the single-path routing does not achieve high throughput at the surface sink. Due to this reason, this protocol has
  less reliability in data packets.
  3) EEDBR
  The energy-efficient depth-based routing (EEDBR) scheme
  is presented in [11] for underwater WSNs. This protocol
  diminishes the energy constraints of the low depth nodes
  in [25]. In the EEDBR scheme, the source node generates a
  hello bag and transmits it among all the neighbors. The hello
  bag contains the details about the node’s depth and remaining
  energy. The hello bag is exchanged among the neighbors
  in the transmission range until all the neighbors receive the
  packets. The node residing more deeper as compared to the
  source will not considers as the best forwarder. Because it has
  more distance from the surface level. The picking of destination is by the maximal remaining energy as well as minimal
  depth. The EEDBR scheme utilizes a distributed mechanism
  to maintain the residual energy in each node. Furthermore,
  it employs an energy balancing technique to balance the
  energy of nodes residing at a low level in the water. This
  protocol improves the overall network lifetime and minimizes
  packets’ latency. But, it suffers from low-reliability issues
  due to unchecking of channel conditions during the packets
  forwarding process.
  D. COOPERATIVE ROUTING PROTOCOLS
  Cooperative routing is defined as the forwarding of the same
  packet via multiple routes. Cooperative routing diminishes
  the unfavorable channel effects. The forwarding of packets along single-hop may not always ensure efficient packets delivery. Therefore, the cooperative routing technique is
  introduced to tackle this issue. The conventional routing protocols that use cooperative routing in the delivery of packets
  are listed below:
  1) DEAC
  broadcasted to exchange the information. The hello packet
  contains the depth position and energy left in the node.
  The source stores nodes’ information in a table. In addition, the plodding approach is used to carry the information without any collision. Furthermore, the best forwarder
  is selected with the help of a function parameter. The second best forwarding candidate is selected with the help
  of the second-highest function parameter and so on. The
  destination gets multiple copies of the packet such as a
  direct and relaying packet. It combines all the copies of the
  packet via the maximal-ratio combing (MRC) technique and
  transmits it to the sink node. The scheme has good performance for the packets delivery ratio. However, it consumes
  more energy because of data forwarding in a cooperative
  fashion.
  2) EECOR
  An energy-efficient cooperative opportunistic routing
  (EECOR) is presented for UWSNs [29]. The EECOR scheme
  employs the cooperative technique in the packet delivery
  process. This, cooperative routing diminishes the unpleasant
  behaviour of the channel during packet forwarding. In cooperative routing, the destination ensures reliable packets reception due to multi variants of the packets. Furthermore,
  the source accepts the node for packets advancement only
  if it has high residual energy as well as low depth level. The
  protocol improves network reliability and minimizes energy
  consumption because of a fuzzy logic algorithm. In the fuzzy
  logic approach, the best forwarding node is selected in the set
  of relay nodes. The EECOR scheme increases the network
  life-span and maintains the nodes active for a long period.
  Also, it decreases the latency during packet transmitting and
  enhances packet advancement. But on the other side, the sink
  receives a packet having no method to checks the status of the
  link.
  3) CoDBR
  Hina and her co-workers proposed a cooperative depth-based
  routing (CoDBR) protocol for UWSNs [19]. In this scheme,
  the information is carried out by using the best forwarding node. The best forwarding candidate is choosing by
  only depth knowledge. Furthermore, the data cooperation
  is applied whereas the destination node receives many
  copies from multiple routes. This type of routing ensures
  high packets reception at the sink and overcomes the issue
  of packets dropped in the networks. CoDBR scheme is a
  localization free where the coordinates of the nodes are
  not required. The protocol achieves high packet advancement at the destination of the target but consumes more
  energy. Also, the nodes deployed close to the water surface died soon because of high data traffic and redundant packet transmission. Moreover, the packets in the
  network take more time while delivering towards the surface area. Table. 1 presents the comparison of routing
  schemes.
  III. PROPOSED NETWORK MODEL
  The proposed schemes are based on energy efficiency as
  well as packets reliability, therefore this section presents
  the overview of network configuration, energy, and channel
  model. The detail of each one presented as follows:
  A. NETWORK CONFIGURATION
  The network is simulated in three-dimensional space with
  500 m of length, where the deployment of nodes is accomplished in a random fashion. The upper portion of the water
  surface depicted the position of the sink nodes. The sink
  node collected data packets and further forwards the packets
  towards the onshore data collecting center. The data collecting center extracts the desired information from the received
  packets and processes the data packets further, as showcases
  in Fig. 4. The deployed nodes are energized with confined
  power through batteries. The nodes are capable of calculating
  its neighbors’ depth level. The nodes in the network broadcast
  with each other through acoustic waves. The sinks are hybrid
  nodes and facilitated with acoustic as well as radio communication. The modem generated radio waves are responsible for broadcasting with data collection centers while the
  acoustic one is helpful for communicating with the nodes in
  water. Acoustic waves provide a better solution in underwater
  communication because the radio waves suffer from various
  factors like signal attenuation, the time variation of a channel,
  multi-path fading, and small available bandwidth.
  B. ENERGY MODEL
  This model is the auditing of energy consideration in three
  different stages such that transmitting, receiving, and idling
  modes. It concludes all the energy information by simply
  using mathematical equations. Each sensor node consists
  of an acoustic modem which is used for the sending and
  receiving of the packets. The consumption of transmitting the
  packets of length Pl with its distance dist is follows as [30]:
  Entr(Pl, dist) = (Endi × Pl) + (bp × Pl) (1)
  where Entr is the energy used for transmitting of Pl
  to dist.
  the variable SN is the total nodes that take participation in the
  network. The power dissipation in the case of transmission
  can be calculated as:
  Ptr = Pat + Pdt + Pam + Pst (5)
  Pr = Par + Pdr + Pln (6)
  here, Pat and Pdt is the analog and digital circuit losses at
  transmission side, and Par and Pdr are at receiving side,
  respectively. The power consumption of the amplifier and
  signal transmission is denoted by Pam and Pst , respectively. The low noise amplification consumption is indicated
  with Pln. The overall power consumption of the transmitter
  and receiver is shown by Ptr and Pr
  .
  C. CHANNEL MODEL
  Several challenges such as channel noise, low speed of acoustic waves, attenuation, and absorption, etc. are associated
  with the underwater medium which hinders the successful
  transmission of packets. The detail of each one is discussed
  below:
  1) CHANNEL NOISE
  In underwater wireless acoustic sensor networks, different
  types of noise sources are associated with the acoustic
  medium. As a result, the data packets get corrupted and the
  performance of the network is reduced due to information
  loss. Hence, the acquisition of the desired information is
  quite challenging. The underwater noise can be categorized
  into two classes such as the site-specific and the ambient
  noise. The first one, noise occurs only assertive domains
  that contain significant non-Gaussian components, while the
  ambient noise is usually associated with the background of
  the ocean environment. The generation of ambient noise takes
  place due to shipping sources, waves generated on the ocean
  surface by wind, the temperature of the sea, and turbulence.
  Each noise component has its power spectral density (PSD),
  and can be modeled as in [31]:
  10logNsh(f ) = 40 + 20(s − 0.5) + 26log(f )
  −60log(f + 0.03) (7)
  10logNwv(f ) = 50 + 7.5w(1/2) + 20log(f )
  −40log(f + 0.04), (8)
  10logNtb(f ) = 17 − 30log(f ) (9)
  10logNth(f ) = −15 + 20log(f ), (10)
  N = Nsh + Nwv + Ntb + Nth (11)
  where Nsh, Nwv, Ntb and Nth represent PSD of shipping,
  waves, turbulence and thermal, respectively. The PSD of
  total noise N can be expressed in decibel (dB). The variable s represents the shipping activities in water by taking the value in [0,1] interval, the frequency f denotes
  with kHz and w indicates the wind’s speed in meter per second at the ocean top. Fig. 5 shows different noise levels in
  seawater.
  2) PROPAGATION DELAY AND ATTENUATION
  The acoustic waves cover the distance with a speed
  of 1500 m/s in the water. The channel opposes greatly on a
  signal which degrades the performance while traveling from
  a sender to the point of destination. Similarly, the absorption
  and spreading loss in the acoustic channel also cause attenuation. The attenuation factor A(d, f) in terms of distance d in
  km and frequency f in kHz, which is computed in dB re µ Pa
  The salinity S in the water can be measured
  in parts per thousand (ppt). Fig. 7 depicts the sound speed
  profile in deep water.
  IV. PROPOSED WORK
  This section presents the two proposed routing protocols in detail. The first protocol energy path and channel
  aware (EPACA) brings energy efficiency, while the rest
  one cooperative energy path and channel aware (CoEPACA)
  enhances packets’ reliability in the network. The detail of
  each one is given as follows:
  V. FIRST PROPOSED APPROACH: THE EPACA PROTOCOL
  A. NETWORK INITIALIZATION AND
  NEIGHBOR RECOGNITION
  Sensor nodes which are distributed in a random arrangement,
  are fully charged initially and are not aware of one another.
  The source, first of all, generates a hello packet which consists
  of a total of eight bytes [34]. Only that node acknowledges
  the hello packet that is in the source node’s range. The hello
  packet holds the information of all the sensor nodes as shown
  in Fig. 8. A source uses the information of sender ID, packet
  sequence, residual energy Re, packet history Hp, bit error
  rate (BER), and distance d to identify the best forwarder
  node. Those nodes which received a hello packet can be able
  to calculate the desired function values. The nomination of
  the best candidate is based on the desired function which is
  embedded in the hello packet. In the function, the distance d
  between source i to the neighbour j can be calculated by using
  the Euclidean distance equation
  
  where the terms xd shows the x-axis and yd shows the y-axis
  coordinates of the node. To find the BER, let us consider an
  example where the source transmits a packet to destination
  node that consists of total nine bits. The number of changed
  bits at the destination indicates the quality of packet. In this
  protocol, we consider a threshold T that’s mean If the destination receives a number of changed bits more than three. It will
  not accept the packet to forward it to the next destination. The
  Equation 17 below shows the calculation of BER, where Nerr
  denotes the number of corrupted bits and Ntra the total bits
  transmitted. The concept of BER is shown in Fig.9 below.
  Furthermore, a source retransmits the hello packet when it
  does not receive any response from its neighbor nodes inside
  the transmission range. This process is continued for a specific time and then the packet is discarded in case no neighbor
  is available in the transmission range. Once the node receives
  the data, it checks and extracts the desired information. Each
  node is passed through this process and the completion of this
  procedure makes every node able to know all the information
  about each other. The identification of the neighbor node is
  B. DATA FORWARDING
  This subsection presents the description of path establishment. The path establishment consists of explaining how
  information packets reach the sink node? And how the destination node contributes to the packets forwarding mechanism? In the proposed scheme, the source node embeds
  the relay(s) and destination node’s ID to the generated data
  packets and then forwards it towards the water surface. The
  picking procedure of the point of destination is purely based
  on the function parameters. The node that achieves the maximum outcome from the weighting function is considered
  as the best forwarding candidate. The nomination of best
  forwarding candidates is based on the highest Re, history of
  packets, lowest BER, and the shortest distance among the
  nodes as shown in Fig. 11 and 10. The process is the same for
  all rounds and the destination is selected through this process.
  A packet reaches from the underneath of the water to the top
  is considered as a successful complete round. By using the
  proposed weighting function, the proposed scheme delivers
  the maximum packets to the surface area with the cost of
  low energy consumption. Fig. 12 shows the flowchart of data
  forwarding in the EPACA protocol.
  C. JUSTIFICATION OF EPACA
  Our first approach EPACA is the energy-efficient protocol which ensures less exhaust of energy. The reason for
  the low consumption of energy is based on the picking
  of the best node via calculated function attributes. During the optimal relay selection, the factor lowest physical distance decreases the latency. Therefore, this scheme
  ensures not only energy efficiency, but it can also deliver
  packets to the surface sink with minimal time latency.
  Hence, this routing scheme is applicable for applications
  requiring long-lasting communication as well as for delaysensitive such as undersea warning and havoc identification
  systems.
  VI. SECOND PROPOSED PROTOCOL: CoEPACA
  In the EPACA routing scheme, the source node uses a single link to forwards the packets towards destination point.
  Using a single route may not always ensure reliability in data
  exchanging. To handle this issue, the CoEPACA protocol is
  proposed which presents the solution in an effective way.
  The network modeling and initial broadcasting are similar
  as in EPACA scheme. The selection of relay(s) and then the
  destination node in a cooperative fashion are discussed below
  in subsections.
  A. RELAY AND DESTINATION SELECTION
  This phase presents the packets forwarding mechanism of
  our second proposed protocol (CoEPACA), which is the
  amended interpretation of EPACA protocol. The destination
  selection criteria of the CoEPACA protocol are the same
  as EPACA protocol. In CoEPACA the source transmits the
  information packets towards the sink node using a single-hop
  method as shown in Fig. 13. When the information bags
  are forwarded to the destination, at the same time relay
  node also receives the data packet because of the broadcast
  nature. Though, the packet is then forwards towards the target destination in a cooperative fashion. Sink node extracts
  information from the data packet and transmits it to the data
  collection center. In CoEPACA the choosing of relay and the
  target destination is the same as discussed in EPACA protocol. When the source broadcasts the information packets,
  all of its neighbors are capable to receive it. The decision of
  the destination is based on the desired attributes as given in
  Equation 18. The source then selects that node as a destination
  which has maximum function value. If the selected node
  meets the desired parameters then it is considered as the
  first destination. However, if the selected destination does
  not meet the desired attributes then a source transmits a
  request (REQ) to the second priority node which is known
  as the relay. The selection of the relay node is also specified
  similar to the target selection definition. The relay sends an
  acknowledgment (ACK) in response to the request (REQ) of
  the destination, as shown in Fig. 14. Once the relay node and
  destination are selected then it sets a sequential arrangement
  for data forwarding.
  B. DATA COOPERATION
  The approach of cooperation is used to diminish the adverse
  channel effects in a network. As shown in Fig. 15, the relay,
  and destination receive information bags in broadcasting
  nature. Furthermore, the relay node also amplifies the packet
  arrived from a source by using an amplifying factor (AF)
  as discussed in [35]. The point of destination receives two
  variants of the same packet. The one packet through direct
  transmission from a source while the rest one via relay to the
  target destination. The packet received from destination d to
  relay r and source s is modeled as [35]:
  
  C. DATA COMBINING TECHNIQUE
  In the proposed CoEPACA routing scheme, the destination
  combines multiple data copies by using maximal ratio combine (MRC) [35] technique and forwards the optimal packet
  to the next one. The MRC first checks the BER of both the
  copies i,e from source, and relay. If the data packet is counted
  as ≤ 0.3 then it will accept the packet, otherwise, it will not
  forward further. This procedure will continue until the data
  arrives at the top area. The proposed work is discussed in the
  flow chart as depicted in Fig. 16. If the sink comes close to
  the source range, then it receives the packets directly. Otherwise, the desired sink node will repeat the process unless the
  packets reached the onshore data center. The received signal
  from multiple sources is given as [37]:
  Yd =
  X
  k=1
  gkd × Ykd (25)
  where Ykd is the received signal and gkd is the channel gain
  between source and destination from multiple links. The total
  number of branches M = 2 is given as:
  Yd = gsd × Ysd + gsr × Ysr (26)
  this shows that multiple copies are received by destination
  where the MRC technique is used to reduce to the probability
  of corrupted data. The BER can be computed as given in [35]:
  BER =
  1
  2
  
  1 −
  s
  Se/Ne
  1 + Se/Ne
  !
  (27)
  the terms Se and Ne are the signal and noise energy,
  respectively. The transportation of the packets from one node
  to another is by using binary phase-shift keying (BPSK)
  technique.
  D. JUSTIFICATION OF THE CoEPACA
  The second proposed scheme CoEPACA protocol improves the network link quality and provides reliability in a network. The achievement of the improved reliability is because
  of the optimal picking of the node forwarders and then transmitting the packets in a cooperative fashion. As delivering the
  packet with multiple paths avoid the adverse channel effects,
  which reduce the probability of packets loss. This ensures
  to achieve maximum packets at the sink surface. The main
  focus of the CoEPACA protocol is to achieve high reliability,
  which can be used in applications requiring reliable delivery
  of packets such as military applications and in an undersea
  warning.
  TABLE 2. Simulation parameter.
  VII. SIMULATION RESULTS AND ANALYSIS
  All experiments were performed using MATLAB. We compared our result with CoDBR [19], as both protocols avoiding
  adverse channel effects by taking cooperation into account.
  However, unlike the CoDBR protocol, the proposed schemes
  make use of function criteria which avoids the rapid death
  of low depth nodes. Hence, the void-hole problem is solved
  in this method. Table. 2 lists the parameters used in the
  simulation. The considered area is in three-dimensional (3D)
  whereas the nodes are distributed in an unsequenced position,
  as shown in Fig. 17. The size of each wall is considered
  as 500 m. The total number of nodes is considered 225,
  as in counterpart scheme. The sinks are fixed at the surface
  area and are connected to the information collection center.
  The LinkQuest UWM1000, acoustic modem with a bit rate
  of a size 10 (Kbps) is used in simulations [38]. The sinks
  utilize the sound modem for packet exchanging with the
  nodes in water, while the modem generating radio waves is
  for an onshore data center. The sensors used for pressure are
  installed with the nodes that help in the measurement of depth
  information from the surface level. The range of transmission
  of each node is considered as 100 m in every direction.
  All the nodes consume 2 W, 10 mW, and 0.8 W of power
  for transmission, idle, and reception purposes, respectively.
  The amount of start-up energy for every node is considered 11 J. The source node exchanges a hello packet with a
  size of 8 bytes [34] and 50 bytes [39] for a single packet.
  A. PERFORMANCE PARAMETERS
  The proposed protocols, evaluate the following parameters by
  using evaluation metrics.
  where sending and receiving time for the number of packet N
  is denoted by Tn and Rn, respectively.
  5) DEAD NODES
  The nodes in the network that consume the overall energy that
  is assigned initially.
  6) ALIVE NODES
  The nodes that still contain energy and have not drained the
  overall energy which is assigned at the start of the network.
  B. TOTAL ENERGY CONSUMPTION
  The result of the consumed energy is depicted in Fig. 18.
  As the number of rounds increases the energy consumption
  of the nodes increases in all protocols. The consumption of
  energy of the counterpart scheme is greater than the proposed protocols. This is because of the high death rate of the
  nodes residing near the water surface. Also, forwarding the
  same packet by many paths leads the network to consume
  high energy. In CoEPACA protocol, the source utilizes the
  status of the residual energy during the selection of the best
  forwarder. This method consumes less energy during packet
  transmission in the network. The probability of packet failure
  in the EPACA protocol is low therefore the retransmission of
  the same packet is not needed. In other words, the EPACA
  protocol forwards the packets without any cooperation, so it
  consumes very little energy as compared to CoDBR and
  CoEPACA protocol.
  C. PACKETS DELIVERY RATIO
  The average PDR of all the protocols is plotted in Fig. 19.
  The PDR of the CoEPACA is higher than the other protocols because it avoids the adverse channel effects by taking
  SNR and BER into account. Also, it excludes the relays that
  deployed in the same depth or at a higher depth than the
  source, provides the greater PDR. In addition, CoEPACA
  forwards the packets not only in a single way, but it can
  also forward the packets via multiple paths, this causes high
  packets acceptance ratio at the sink surface. The PDR of
  the CoDBR protocol is higher than EPACA but less than
  CoEPACA. It is due to the packets forwarding in a cooperative manner, therefore it achieves better PDR than EPACA.
  However, there is no checking mechanism of the channel
  condition, so it has a lower PDR than CoEPACA. The EPACA
  protocol utilizes the channel condition mechanism, however,
  in case of no optimal node in the transmission range of the
  source node. It simply holds the packet until there is no
  optimal node, this cause less PDR in the network.
  D. TOTAL END-TO-END DELAY
  The plot of end-to-end delay of all protocols is shown
  in Fig. 20. The delay of CoEPACA is greater than the other
  protocols. It is due to the data forwarding in a cooperative
  manner. In the cooperative approach, the source makes use
  of multiple paths during forwarding the data to the point of
  destination. The destination acknowledges the packet receiving source. In other words, a source checks the condition
  of the link while sending data. If the link is found robust
  then it delivers the packet to the target destination, otherwise,
  it waits. This results in high latency in the network. The delay
  of the CoDBR protocol is higher than the EPACA protocol
  because it uses a cooperative routing technique. Also, it has
  no checking mechanism therefore it has a lower delay than
  the CoEPACA protocol. The EPACA has the best delay and
  it does not take a long time during delivering the packets to
  the surface sink.
  E. DEAD NODES
  The result of the dead nodes of all protocols is illustrated
  in Fig. 21. As plotted in Fig. 18, the energy consumption
  in the EPACA protocol is less than the other two protocols. Therefore, the death ratio of the EPACA protocol is
  lower than the CoDBR and CoEPACA protocols. Same as
  in the case of CoDBR protocol, the packets transmitted with
  the cost of high energy consumption which tends the network
  to high death ratio of the node. In the CoEPACA protocol,
  the packets’ failure probability is lower therefore low energy
  is consumed during data delivery. The retransmission of the
  packet is no longer needed so the rate of the dead nodes is
  lower than the CoDBR protocol.
  F. ALIVE NODES
  The plot of alive nodes is depicted in Fig. 22 which is reciprocal of Fig. 21. As the rapid death ratio of the CoDBR causes
  the network to unstable for a long time, therefore a few nodes
  remain alive for communication in the network. In the same
  way, the greater number of nodes are alive in EPACA and
  CoEPACA protocols.
  sinks.
  VIII. CONCLUSION AND FUTURE WORK
  Routing protocols in the underwater face the number of
  challenges due to the unpleasant aqueous environments.
  The nodes residing nearer the water surface consume more
  energy because of the high data burden. The early death of
  nodes having low depth creates void holes in a network.
  To avoid the void holes and prevent the low depth nodes from
  early depth. This paper discusses the two routing schemes,
  namely energy path and channel aware (EPACA), and cooperative energy path and channels aware (Co-EPACA) to
  enhance energy efficiency and network reliability in UWSNs.
  The EPACA algorithm minimizes the energy consumption by
  taking into account the node’s residual energy (Re), history of
  packet transmitting(Hp), lowest distance from sink node (d)
  and bit error rate (BER). Furthermore, the Co-EPACA algorithm delivers the packets in a cooperative method to improve
  the reliability of the network. The MATLAB simulations
  validated the performance parameters: energy consumption,
  packets delivery ratio, delay, dead and alive notes. The result
  clearly demonstrates that the proposed algorithms achieve
  good performance than the CoDBR protocol in terms of
  reliability, energy efficiency, and network lifetime. In the
  future, the opportunistic and mobile sink idea can be implemented to collect the packets from the bunch of nodes,
  which further transmit them to the water surface within low
  latency. In opportunistic routing, the sensor nodes are combined and make a group that delivers the packet towards the
  final destination instead of via single node selection. This
  method relaxes high traffic on a single node and prevents the
  node from early depth. The idea of future work is illustrated
  `
}
