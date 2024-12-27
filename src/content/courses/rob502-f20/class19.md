---
title: "ROB 502: Programming for Robotics: Class 19"
date: "2020-07-07"
---

## The internet is an onion

In order for you load `https://google.com` in your web browser, your request has to pass through many different layers. There are several different models of these layers because they can be fairly arbitrary. Our discussion will be based on the TCP/IP model, which is specific to website interactions. We'll start from the application layer, represented by your web browser itself, and work our way down.

### Application layer

The web browser wants to load HTML, Javascript, and CSS in order to display a web page.

In order to connect to `google.com`, the browser has to translate this name into an Internet Protocol (IP) address. To do this it contacts a Domain Name Server (DNS) to map the domain `google.com` to an address. On my computer I get either the address `2607:f8b0:4009:800::200e` (ipv6) or `172.217.5.14` (ipv4). The version 6 standard is newer and has many advantages, but not all networks support it yet (MWireless does not!).

The browser then uses the Hypertext Transfer Protocol (HTTP) to make a request to `2607:f8b0:4009:800::200e` that might look like: `GET / HTTP/2` `Host: www.google.com`, requesting the home page of the Google website. An IP address can serve multiple domain names, so the specific domain desired is specified in the request as the "Host".

### Transport layer

To make a private connection, the browser uses Transport Layer Security (TLS), a cryptographic protocol that prevents other computers from eavesdropping on your HTTP requests/web browsing. Newer browsers (mainly just Firefox) now also have an option for DNS over TLS which also prevents eavesdropping on which website you are trying to connect to. Currently, when you see a padlock in your browser it means that your connection is private because it is encrypted with TLS. This _does not_ mean the website is trustworthy or safe in any way, it just means other people can't eavesdrop on your connection, although _they can_ eavesdrop on _which_ websites you connect to because DNS is not commonly encrypted.

#### Transmission Control Protocol (TCP)

For most website connections, the browser then uses the Transmission Control Protocol (TCP). TCP groups data into small segments (packets of around 100 to 1500 bytes) and provides a lot of guarantees about these segments. It guarantees that they will all reach the destination in the correct order and without errors, and if the connection is struggling to succeed because of congestion in the network or an unreliable connection, TCP will automatically slow down and continue to retry sending the segments until it receives confirmation that they have been correctly received. These features are very useful for properly loading websites, but also come with a lot of overhead in the protocol.

Each TCP segment is marked with both a source and a destination _port_ number. By having different ports, your computer is able to have many distinct connections for every program that wants to connect to the internet. For a web browser, the source ports (on your computer) are generally arbitrary, since each connection may need a different port, but the destination ports are significant: unencrypted web traffic uses port 80, web traffic encrypted with TLS uses port 443, and the SSH (secure shell) command uses port 22.

#### User Datagram Protocol (UDP)

In contrast, the User Datagram Protocol (UDP), sometimes referred to as the _Unreliable_ Datagram Protocol, makes none of these guarentees. Messages can get lost, out of order, and its only an option to check that messages are received without errors! The benefit of UDP is that because it has very low overhead, it has low latency and high throughput. LCM uses UDP for message passing, especially since old messages can quickly get out of date and the slowdown for guaranteed receipt is not always worthwhile. ROS has been trying to add UDP as an option but generally uses TCP. There have also been some movements to use UDP for mobile internet because TCP tends to mistake a poor connection for network congestion, resulting in an even slower connection.

Just like TCP, UDP datagrams also have both source and destination ports that allow different applications to use UDP at the same time.

#### Clicker questions

Every 10ms, your PlayStation controller transmits joystick and button readings to your robot to control its motion. Every 5 seconds, your robot transmits back logging information about the performance of your algorithm. You plan to use this logging information to make figures for your paper. If it were just as easy to use TCP or UDP for any combination of these messages, which should you choose?

1. TCP for both
2. UDP for both
3. TCP for robot control and UDP for logging information
4. UDP for robot control and TCP for logging information **19.1 Use p4r-clicker to submit your answer**

You get an email from the University of Michigan asking you to check that you have properly registered for courses for the Winter 2020 semester. You click on the provided link and see that the login page looks normal and there is a padlock next to the website URL. You enter your credentials to log in, including the Duo Security two factor authentication. Where you safe or did you maybe make a mistake?

1. I was safe!
2. I maybe made a mistake. :( **19.2 Use p4r-clicker to submit your answer**

### Internet layer

In order for a TCP or UDP packet to actually get from your computer to a destination computer, it has to pass through many different routers. To make this work, the TCP/UDP packet is wrapped up in an Internet Protocol (IP) packet that also contains the source and destination IP addresses. The IP addresses tell the routers how to "route" the packet to its destination.

These routers exist at multiple levels, such as your home WiFi router, University of Michigan network routers, Internet Service Provider routers (like Comcast's Xfinity), and many other routers located at the city, national, and international levels. Each router maintains a routing table with information about where to send your TCP/UDP packet to so that it will eventually reach the target IP address specified in the IP portion of the packet. The router might recognize that the IP address is a local one and it can broadcast it on its local network, but it also might recognize that it needs to send the packet to one of the many neighboring routers it has a physical connection to.

The routing table can be built in many different ways, but generally it is dynamic and the routers continually update each other with information about which routers they are connected to and which IP addresses they know how to connect to and how fast their connections are. In this way, routers can learn enough about the entire network that they can determine the fastest path for your packet and also be aware of alternative paths in case a neighboring router stops responding.

#### Demo

The command line tool `traceroute` builds a list of all the routers that connect from your computer to any website you give it. It does this by sending a series of UDP "ping" packets with a specially set IP parameter called "time to live". Normally, this time-to-live parameter starts out at 255 and every time a router passes the message on, it decrements the value. If it ever reaches zero, the router is convinced there must have been some cycle in the way the way the message has been routed. To prevent the message from being passed in circles indefinitely, it drops the packet and sends an error message back to the source computer. The `traceroute` utility makes clever use of this feature. It sends out many different messages with time-to-live values of not 255 but with 1, 2, 3, 4, and so forth, and then makes note of which router IP address the error messages are returned from, until finally the message manages to make it to the destination.

We can use this tool to see that some addresses are physically many fewer "router hops" away than other addresses.

```
traceroute umich.edu
traceroute google.com
traceroute amazon.co.jp
```

We can observe how this happens with a tool called [Wire Shark](https://www.wireshark.org/).

### Data link layer

Once a TCP/UDP packet has arrived at the router responsible for the destination IP address, that packet has to be sent to the correct device on that specific network. The Internet Protocol, as its name implies, is actually only meant for communications across _different networks_ and isn't actually used at this level. Mostly likely, the router will communicate with your computer either over WiFi (for wireless connections) or Ethernet (with a physical cable), and these protocols identify devices with something called a physical address (also called a MAC address) instead of an IP address. With an ipv4 address, the computer or router has to perform address translation (like with the Address Resolution Protocol, ARP) to map the IP address to a MAC address. With ipv6 addresses however, the MAC address is embedded inside of the ipv6 address, saving a step.

When the router knows the MAC address of the packet's recipient, it can then broadcast the packet on the Ethernet or WiFi network. All the devices on that network then compare the destination MAC address of the packet with their own MAC address to know if the message is for them. This means that with the right hardware setup, it can be easy to eavesdrop on other people on the same network. Ignoring packets not intended for you is just a convention. This is why the encryption from TLS in the transport layer above is so important! For performance, most hardware network adapters automatically drop packets not intended for them, and it can take some tricky configuring to eavesdrop on communications from a consumer laptop.

#### Demo

The sample website at [http://zero.webappsecurity.com/](http://zero.webappsecurity.com/) does not use TLS and using [Wire Shark](https://www.wireshark.org/) on my computer, I can "spy" on the password I enter when I try to log in.

### Physical layer

The last layer is the physical layer, and it answers the question of "how are bits actually represented in a physical medium?" The perhaps most common medium we are used to are the radio waves that make up WiFi, and there are various standards for how the data is translated to radio waves and back again. Whenever you hear about different speeds of WiFi and 2.4GHz and 5.0GHz WiFi, these all correspond to different protocols at the physical layer. The next most common is probably Ethernet, which uses electrical voltages over copper wiring. Fiber optic cables are also an extremely common medium for traveling far distances with lots of bandwidth. For illustrative purposes, we'll talk about copper-based Ethernet on the physical layer with the relatively old 10BASE-T variation.

The 10BASE-T Ethernet protocol uses something called [Manchester coding](https://en.wikipedia.org/wiki/Manchester_code), which encodes a "1" bit as a transition from low to high and a "0" bit as a transition from high to low. The data rate of the link (up to 10Mbps for 10 million bits per second) determines when those transitions are expected, and a transition at an unexpected time is ignored. This lets Manchester coding repeat bits as much as necessary.

The WiFi/Ethernet protocols at this level also have the concept of "frames" which encapsulate the higher-level TCP/UDP packets. For example, the Ethernet protocol has to figure out how to translate a stream of bits (just 1 or 0!) into the correct bytes, with the packet starting at the right place. In 10BASE-T, it does this by saying that any Ethernet frame will start with no data present (using a medium voltage!) and then by having a long series of alternating 1's and 0's. This _preamble_ lets the receiving device synchronize to the frame and know when to read the voltage transitions that encode bits and also when to ignore the transitions that don't encode information. When the preamble finally repeats two 1's, then the preamble is over and the actual packet it about to begin.

#### Clicker questions

I have a WiFi connection but unfortunately, I can't seem to connect to Google. I really have to print out this paper I have on my laptop, though, and the printer is also connected to the WiFi. Is this a problem?

1. Yes! I'll fail!
2. No! I'm fine! **19.3 Use p4r-clicker to submit your answer**

### More information about the network traffic layers

YouTuber Ben Eater has an [excellent series of videos](https://www.youtube.com/watch?v=XaGXPObx2Gs&list=PLowKtXNTBypH19whXTVoG3oKSuOcw_XeW&index=1) that illustrate all the concepts I've talked about above.

## Joining a network

There are several pieces of important information that a computer has to have in order to join a either a WiFi or Ethernet network and communicate over the Internet Protocol.

### Default gateway/router address

First we need to have the IP address of the router. This is often called the _default gateway_ of the connection, because in order to communicate with outside networks, we will need to send data packets to the router.

### Domain name servers (DNS)

Second, we need to configure which Domain Name Servers (DNS) to use. Often these can be obtained automatically, or maybe your Internet Service Provider (ISP) will specify the correct IP addresses to use. Nowadays, we also have public DNS services provided by big internet companies like Cloudflare (with the 1.1.1.1 and 1.0.0.1 DNS servers) and Google (with the 8.8.8.8 and 8.8.4.4 DNS servers). Theoretically, your ISP should be able to provide the fastest DNS servers because they have servers very close to your physical connection! Unfortunately, in practice, these ISP-provided DNS servers can be relatively slow, and ISP's are known for selling lists of website queries to advertisers. The University of Michigan has its own dedicated DNS servers (10.10.10.10 and 10.10.5.5) and they are very fast.

### Net mask

Another (and perhaps less important) number is the _net mask_, which specifies what the valid IP addresses for the network are. In the net mask, any 1 bit indicates that the given bit cannot be changed to form another valid IP address in that network. My WiFi connection at my desk here on MWireless has a default gateway of `35.3.0.1` and a net mask of `255.255.128.0`. Since 255 is a byte with eight 1 bits, the upper two numbers of the address can't change (and they are also most likely not owned by Michigan). The 128 indicates that only the highest bit of third number can't change. So, valid addresses will go from `35.3.0.0` to `35.3.127.255`, for a total of 128 \* 256 = 32768 different possible addresses, although several of these are reserved for special uses.

A common setup for home networks is to have the router default gateway at `192.168.0.1` and have a netmask of `255.255.255.0`, so that there are a total of 256 possible addresses from `192.168.0.0` to `192.168.0.255`.

### IP addresses and DHCP

The last number (and perhaps most important!) is the IP address for your computer itself. Most of the time, your computer uses the Dynamic Host Configuration Protocol (DHCP), and sends out a _broadcast_ message to the whole network, asking if there is any DHCP server able to assign it an IP address. Most often the router will also be acting as a DHCP server and will respond to the computer and then also assign your computer an IP address. My computer currently has an ipv4 address of `35.3.83.29`.

For the newer ipv6 addresses, the computer is able to self-assign an ipv6 address based on the computer's MAC address: this is possible because there are so many ipv6 addresses available! At home, one of my computers has the ipv6 address of `2601:400:8000:6d::c0a:e9ee`. The first four sections of are constant based on my ISP, but the remainder are free for my computer to choose itself.

It also possible for you to manually set your computers IP addresses (for either ipv4 or ipv6). Sometimes, the only reason you can't get internet is that your routers DHCP server has malfunctioned. In situations like this, manually choosing an IP address can give you access to the internet. Normally, when you computer has failed to acquire an IP address through DHCP it will self-assign a special _link-local_ address that looks like `169.254.X.X`. This address range is intended for when computers connect directly to each other without a DHCP server, and want to communicate. If they both choose special addresses like these, then they can talk to each other. However, if your computer is the only one with a link-local `169.254` address, it won't get internet access! A static IP address (meaning a manually set one that stays the same), can fix this issue.

Another case where a static IP address may be useful is when you want your computer to act as a server to respond to web requests from other computers. For these computers to find your IP address, they will need to either know your IP address directly, or be able to look it up from your website name with DNS. This is easiest when your IP address is static, but there are also dynamic DNS services available that can help keep your DNS record up to date even as your server's IP address changes every once in a while.

### Loopback

Finally, there is a special IP address `127.0.0.1` with the meaning of "loopback". This means that any computer which connects to `127.0.0.1` is actually connecting back to itself. You can also refer to this special IP address by the special domain name `localhost`. This is useful when your computer is hosting a server and you want to connect to it from the same computer!

### Demo

There are several tools you can use from the command line to inspect your network settings.

The `ifconfig` tool shows current configuration settings for all the "network interfaces" your computer has. My computer here has three listed here: Ethernet (not currently plugged in) called `enp0s31f6`, a `localhost` interface called `lo`, and a WiFi (connected to MWireless) interface called `wlp3s0`.

```
ifconfig
enp0s31f6: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        ether c8:5b:76:2e:59:cd  txqueuelen 1000  (Ethernet)
        RX packets 6284967  bytes 6150261298 (6.1 GB)
        RX errors 1  dropped 0  overruns 0  frame 1
        TX packets 1753545  bytes 1036081297 (1.0 GB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
        device interrupt 16  memory 0xf2200000-f2220000  

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 29649338  bytes 157998520855 (157.9 GB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 29649338  bytes 157998520855 (157.9 GB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

wlp3s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 35.3.83.29  netmask 255.255.128.0  broadcast 35.3.127.255
        inet6 fe80::ec7f:832b:86f:f5f2  prefixlen 64  scopeid 0x20<link>
        ether e4:b3:18:7d:a5:97  txqueuelen 1000  (Ethernet)
        RX packets 1928821  bytes 2102151760 (2.1 GB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 649957  bytes 127477110 (127.4 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

The `route -n` command will show what your router's IP address is, under the "gateway" column. For some reason the net mask is called "Genmask" here.

```
route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         35.3.0.1        0.0.0.0         UG    600    0        0 wlp3s0
35.3.0.0        0.0.0.0         255.255.128.0   U     600    0        0 wlp3s0
169.254.0.0     0.0.0.0         255.255.0.0     U     1000   0        0 wlp3s0
```

This command is actually showing your _own computer's_ routing table! It is very simple but says: In general (for any IP address `0.0.0.0`) send packets to `35.3.0.1` (the router). If the address fits in the range of `35.3.0.0` to `35.3.127.255` (a base address of `35.3.0.0` with a net mask of `255.255.128.0`), then we can just broadcast (send to `0.0.0.0`, meaning everyone) that message on the local network and it should reach the destination. Finally, we can also send out a broadcast message on the local network if we are trying to reach a link-local address.
